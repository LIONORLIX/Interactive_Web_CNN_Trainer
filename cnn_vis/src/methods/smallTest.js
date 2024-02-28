import * as tf from '@tensorflow/tfjs';

export async function test(data) {

    const examples = data.nextTestBatch(100);
    // const numExamples = examples.xs.shape[0];
  
    // Create a canvas element to render each example
    // for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
        // Reshape the image to 28x28 px
        return examples.xs
            .slice([0, 0], [1, examples.xs.shape[1]])
            .reshape([28, 28, 1]);
    });

    const inputImage = imageTensor.reshape([1, 28, 28, 1]);

const model = tf.sequential();
model.add(tf.layers.conv2d({inputShape: [28, 28, 1], filters: 8, kernelSize: 3, activation: 'relu'}));
model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
model.add(tf.layers.flatten());
model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

const intermediateModel = tf.model({inputs: model.inputs, outputs: model.getLayer(0).output}); //啊啊啊啊啊啊啊啊我搞明白了
const activations = intermediateModel.predict(inputImage); //输出的tensor：[1,26,26,8] 四个数分别对应：跳过、图像像素排、图像每排像素、8个filter分别处理出来后的值

console.log(activations);
}