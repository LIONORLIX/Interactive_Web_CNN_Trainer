// Based on: https://codelabs.developers.google.com/codelabs/tfjs-training-classfication?hl=en#2
//
// Modified by: Xiang Li
// UAL Student ID: 23009641
//
// Randomly pick one image from MNIST dataset

import * as tf from '@tensorflow/tfjs';

export async function getImageTensor(data) {

  // Get one example from MNIST
  const examples = data.nextTestBatch(1);

  const imageTensor = tf.tidy(() => {
    // Reshape the image to 28x28 px
    return examples.xs
      .slice([0, 0], [1, examples.xs.shape[1]])
      .reshape([28, 28, 1]);
  });

  return imageTensor;
  
}