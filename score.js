const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
 const testSetSize = 100;
 const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

 _.range(1,20).forEach(kElement => { //making prediction for more k elements
 const accuracy = _.chain(testSet)
  .filter(testPoint => knn(trainingSet, testPoint[0], kElement) === testPoint[3])//comparing values
   .size()
    .divide(testSetSize)
    .value()
    console.log('For k of', kElement,'Your prediction was right :', accuracy * 100 , '% of the time');
  });
}

//k nearest neighbour algorithm
function knn(data, point, k){
  return _.chain(data)
  .map(row => [distance(row[0], point), row[3]])
  .sortBy(row => row[0])
  .slice(0, k)
  .countBy(row => row[1])
  .toPairs()
  .sortBy(row => row[1])
  .last()
  .first()
  .parseInt()
  .value();
}

function distance(pointA, pointB){
  //using 3d pythagorean theorem to calculate distance between points x² + y² + z² = s²!
  // pointA = [300, .5, 16] pointB = [350, .55, 16]
  return _.chain(pointA)
  .zip(pointB)  // example _.zip(['a', 'b'], [1, 2], [true, false]); => [['a', 1, true], ['b', 2, false]]
  //Creates an array of grouped elements, the first of which contains the first elements of the given arrays, the second of which contains the second elements of the given arrays, and so on.
  .map(([a,b]) => (a - b) ** 2) 
  .sum()
  .value() ** 0.5;
}

function splitDataset(data, testCount){
  const shuffled = _.shuffle(data);


  //we will use testing set and training set to test accuracy of our algorhitm
                          //array/start position / end position
  const testSet = _.slice(shuffled, 0, testCount);
  console.log('test set',testSet);
  const trainingSet = _.slice(shuffled, testCount);
  console.log('training set', trainingSet);

  return[testSet, trainingSet]
}


