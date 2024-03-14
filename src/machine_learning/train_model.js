// Source from: https://codelabs.developers.google.com/codelabs/tfjs-training-classfication?hl=en#5
//
// Modified by: Xiang Li
// UAL Student ID: 23009641
//
// Main function of training a model
// I add a new callback function to update logs during training and add more description
// 
// Reference:
// https://stackoverflow.com/questions/51910365/how-to-get-an-output-log-from-model-fit-while-its-busy-training
// https://js.tensorflow.org/api/4.17.0/#tf.LayersModel.fit
// https://js.tensorflow.org/api/4.17.0/#tidy

import * as tf from '@tensorflow/tfjs';

export async function train(model, data, setEpoch, setIsTraining, setIsTrainingDone, setTrainingLogs, trainingLogs, epochCount) { // I add more parameters and functions to merge it with my UI and VIS. The most important parameter is epochCount which controls how many rounds should be trained

  const BATCH_SIZE = 512; // the number of training samples in one epoch

  // MNIST dataset have 65000 images. if training has 10 epoches, each epoch can use 6500 image and 5500 for training and 1000 for testing
  const TRAIN_DATA_SIZE = 5500; 
  const TEST_DATA_SIZE = 1000;

  console.log("start training")

  // training process
  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
    return [
      d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
      d.labels
    ];
  });

  // testing process
  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE);
    return [
      d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
      d.labels
    ];
  });

  // callback function, I set it to update logs when an epoch ends
  const fitCallbacks = {
    onEpochEnd: async (epoch, logs) => {
      console.log("Epoch: " + epoch + " Loss: " + logs.loss + " Accuracy: " + logs.acc);

      let updateLogs = trainingLogs

      let newLog = []
      newLog.push(epoch)
      newLog.push(logs.loss)
      newLog.push(logs.acc)

      updateLogs.push(newLog)

      setTrainingLogs(updateLogs)
      setEpoch(epoch)
      if (epoch == epochCount-1){
        setIsTrainingDone(true); // update visulization and UI when the final epoch finished
      }
    }
  };

  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: epochCount, // pass epochCount here
    shuffle: true,
    callbacks: fitCallbacks
  });
}
