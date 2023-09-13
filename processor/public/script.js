

document.addEventListener('DOMContentLoaded', async () => {
  const file = 'glm_ANOVA_Psi_cFos_rb4_z_vox_p_fstat1.nii.gz'

  const LoadersVolume = AMI.default.Loaders.Volume;
  const HelpersStack = AMI.default.Helpers.Stack;

  const container = document.getElementById('container')
  const loader = new LoadersVolume(container);
  const download = false ;

  loader.load([file]).then(() => {
    
    var mergedSeries = loader.data[0].mergeSeries(loader.data);
    var stack = mergedSeries[0].stack[0];
    var stackHelper = new HelpersStack(stack);
    
    if (stackHelper) {
        // Serialize the stack
        const serializedStack = window.MessagePack.encode(stackHelper.stack);
        // Generate a Blob and serialize
        const blob = new Blob([serializedStack], { type: 'application/octet-stream' });

        if (download)
        {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'exported-stack.msgpack';
          link.click();
        }
    }
  });
});