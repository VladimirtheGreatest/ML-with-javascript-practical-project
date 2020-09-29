const outputs = [];
const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
 const testSetSize = 10;
 const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
 let numberCorrect = 0;

 for (let index = 0; index < testSet.length; index++) {
   const bucket = knn(trainingSet, testSet[index][0]);
   if(bucket === testSet[index][3]){
     numberCorrect++; 
   }
 }
console.log('Your prediction was right :', numberCorrect / testSetSize * 100 , '% of the time');
}

function knn(data, point){
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
  return Math.abs(pointA - pointB);
}

function splitDataset(data, testCount){
  const shuffled = _.shuffle(data);


  //we will use testing set and training set to test accuracy of our algorhitm
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return[testSet, trainingSet]
}


