const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
 const testSetSize = 100;
 const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

 _.range(1,20).forEach(kElement => {
 const accuracy = _.chain(testSet)
  .filter(testPoint => knn(trainingSet, testPoint[0], kElement) === testPoint[3])
   .size()
    .divide(testSetSize)
    .value()
    console.log('For k of', kElement,'Your prediction was right :', accuracy * 100 , '% of the time');
  });
}

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
  return Math.abs(pointA - pointB);
}

function splitDataset(data, testCount){
  const shuffled = _.shuffle(data);


  //we will use testing set and training set to test accuracy of our algorhitm
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return[testSet, trainingSet]
}


