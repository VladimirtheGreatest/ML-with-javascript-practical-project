const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
 const testSetSize = 100;
 const k = 10;

 _.range(0,3).forEach(feature => { //dropPosition, bounciness, size, for each feature in our data structure
   const data = _.map(outputs, row => [row[feature], _.last(row)]); //dropPosition, bucket || bounciness, bucket || size, bucket
   const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);
   const accuracy = _.chain(testSet)
  .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))//comparing values, filter out those that meet the prediction
   .size()
    .divide(testSetSize)
    .value()
    console.log('For feature of', feature ,'Your prediction was right :', accuracy * 100 , '% of the time');
  });
}

//k nearest neighbour algorithm
function knn(data, point, k){
 // console.log('data in knn, or training set', data)
  //point will always have 3 values no labels in it
  return _.chain(data)
  .map(row => {
    //initial == Gets all but the last element of array.
    console.log(distance(_.initial(row), point));
    return [ 
      distance(_.initial(row), point),
       _.last(row) //bucket which it falls into last element of the array
    ];
  })
  .sortBy(row => row[0]) //sort by drop position
  .slice(0, k) //take the chunk from the array for k= 3 take 3 rows
  .countBy(row => row[1])
  .toPairs()
  .sortBy(row => row[1])
  .last()
  .first()
  .parseInt()
  .value();
}

var distance = (pointA, pointB) => {
  //using 3d pythagorean theorem to calculate distance between points x² + y² + z² = s²!
  // pointA = [300, .5, 16](prediction point???????) pointB = [350, .55, 16]
  //console.log('pointA', pointA);
  //console.log('pointB', pointB);
  return _.chain(pointA)
  .zip(pointB)  // example _.zip(['a', 'b'], [1, 2], [true, false]); => [['a', 1, true], ['b', 2, false]]
  //Creates an array of grouped elements, the first of which contains the first elements of the given arrays, the second of which contains the second elements of the given arrays, and so on.
  .map(([a,b]) => (a - b) ** 2) 
  // prediction point(training set) - the actual point(testing set)
  .sum()
  .value() ** 0.5;
}

function splitDataset(data, testCount){
  const shuffled = _.shuffle(data);


  //we will use testing set and training set to test accuracy of our algorhitm
                          //array/start position / end position
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);


  return[testSet, trainingSet]
}

//this function helps us to normalize data
function minMax(data, featureCount){
  const clonedData = _.cloneDeep(data);

  for (let index = 0; index < featureCount; index++) {
    const column = clonedData.map(row => row[index]); //get the 1st values of each array 
    const min =_.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++) {
      //formula for normalization
      clonedData[j][index] = (clonedData[j][index] - min) / (max -min); //applying normalization for the biggest value 1 for the smallest 0
      
    }
  }
  return clonedData;
}

