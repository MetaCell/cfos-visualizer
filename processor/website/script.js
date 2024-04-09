document.addEventListener('DOMContentLoaded', async () => {

  // Get the URL of the current page
  var currentURL = window.location.href;
  var url = new URL(currentURL);
  var fileParam = url.searchParams.get("file");

  if (fileParam !== null) {
    const file = '../data/'+ fileParam ;

    const LoadersVolume = AMI.VolumeLoader;
    const HelpersStack = AMI.StackHelper;

    const container = document.getElementById('container')
    const loader = new LoadersVolume(container);

    try {
      await loader.load([file]);

      var mergedSeries = loader.data[0].mergeSeries(loader.data);
      var stack = mergedSeries[0].stack[0];
      var stackHelper = new HelpersStack(stack);

      if (stackHelper) {
          const pixelDataType = stackHelper.stack._frame[0].pixelData ?
              stackHelper.stack._frame[0].pixelData.constructor.name : null;

          const serializationObj = {
              stack: stackHelper.stack,
              dataType: pixelDataType
          };

          const serializedStack = window.MessagePack.encode(serializationObj);
          // Generate a Blob and serialize
          const blob = new Blob([serializedStack], { type: 'application/octet-stream' });

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          fileParam = fileParam.split('/').pop(); //filename only
          link.download = fileParam.replace('.nii.gz', '.msgpack');
          link.click();
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  } else {
    console.log("The 'file' parameter is not present in the URL.");
  }
});