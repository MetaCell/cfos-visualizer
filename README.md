# UNRAVEL - a functional imaging viewer

Unravel is a frontend web application developed using React, Redux and AMI.js that allow the users to interactively explore statistical maps of neuronal activity that reveal differences in brain activity between experimental conditions. Functional imaging in our case is based on fluorescent immunolabeling cFos expression in mouse brains, making the brains optically transparent, and imaging in 3D using a light sheet microscope.

## Data ingestion

The data ingestion is performed from the project root, within the processor folder.

### Preliminaries

#### Create and populate the data folder

Inside the processor folder, create a data folder

```
cd processor
mkdir data
```

Inside the data folder create 2 more folders, one to store all the activity maps (ActivityMap) and one to store all the atlases (Atlas).

```
cd data
mkdir Atlas
mkdir ActivityMap
```

Copy all the atlases nifti files inside the Atlas folder, and as well copy all the statistical maps inside the folder ActivityMap. (the command below is just an example).

```
cp *atlas.nii.gz ./Atlas/
cp *maps.nii.gz ./ActivityMap/
```

For each atlas file copied inside the Atlas folder, copy also the wireframe version being sure to use the same file name followed by a capital W before the dot extension of the atlas.

```Example: if the atlas file is gubra_ano_combined_25um.nii.gz the wireframe file should be called gubra_ano_combined_25umW.nii.gz (capital W before the .nii.gz).```

#### Prepare the index.json and metadata.json inside the data folder

It is responsibility of the user triggering the ingestion also to prepare a file, named **index.json** and a file named **metadata.json**,
both placed inside the data folder, that contains the hierarchical structure of the experiments and the data, according to the data model documented for the project 
and experiments metadata respectively.

Below an example of a working index.json file used during development:

```
{
   "ExperimentsAtlas":{
      "MDMA (social context) maps":[
         "gubra_ano_combined_25um"
      ],
      "Psilocybin (HC; EE) maps":[
         "gubra_ano_combined_25um"
      ],
      "Ketamine v. Naltrexone+Ket maps":[
         "gubra_ano_combined_25um"
      ]
   },
   "AtlasActivityMap":{
      "gubra_ano_combined_25um":[
         "MDMA-data__valid_clusters_where_MDMA_decreased_cFos__q_0.05",
         "MDMA-data__uncorr_1-p__MDMA_greater_than_saline",
         "Psilocybin-data__avg_diff_map__psilocybinEE_minus_salineEE",
         "Psilocybin-data__average_cFos-IF__psilcybin_in_HC",
         "Ketamine-data__average_cFos-IF__ket",
         "Ketamine-data__valid_clusters_where_NalKet_increased_cFos__q_0.05",
         "Ketamine-data__uncorr_1-p__nalKet_greater_than_ket"
      ]
   },
   "ExperimentsActivityMap":{
      "MDMA (social context) maps":[
         "MDMA-data__valid_clusters_where_MDMA_decreased_cFos__q_0.05",
         "MDMA-data__uncorr_1-p__MDMA_greater_than_saline"
      ],
      "Psilocybin (HC; EE) maps":[
         "Psilocybin-data__avg_diff_map__psilocybinEE_minus_salineEE",
         "Psilocybin-data__average_cFos-IF__psilcybin_in_HC"
      ],
      "Ketamine v. Naltrexone+Ket maps":[
         "Ketamine-data__average_cFos-IF__ket",
         "Ketamine-data__valid_clusters_where_NalKet_increased_cFos__q_0.05",
         "Ketamine-data__uncorr_1-p__nalKet_greater_than_ket"
      ]
   },
   "Atlases":{
      "gubra_ano_combined_25um":{
         "name":"Gubra Combined 25um",
         "file":"gubra_ano_combined_25um.nii.gz",
         "LUT":"place_holder.lut"
      }
   },
   "ActivityMaps":{
      "MDMA-data__valid_clusters_where_MDMA_decreased_cFos__q_0.05":{
         "name":"MDMA-data__valid_clusters_where_MDMA_decreased_cFos__q_0.05",
         "file":"MDMA-data__valid_clusters_where_MDMA_decreased_cFos__q_0.05.nii.gz",
         "color": "place holder for color"
      },
      "MDMA-data__uncorr_1-p__MDMA_greater_than_saline":{
         "name":"MDMA-data__uncorr_1-p__MDMA_greater_than_saline",
         "file":"MDMA-data__uncorr_1-p__MDMA_greater_than_saline.nii.gz",
         "color":"place holder for color"
      },
      "Psilocybin-data__avg_diff_map__psilocybinEE_minus_salineEE":{
         "name":"Psilocybin-data__avg_diff_map__psilocybinEE_minus_salineEE",
         "file":"Psilocybin-data__avg_diff_map__psilocybinEE_minus_salineEE.nii.gz",
         "color":"place holder for color"
      },
      "Psilocybin-data__average_cFos-IF__psilcybin_in_HC":{
         "name":"Psilocybin-data__average_cFos-IF__psilcybin_in_HC",
         "file":"Psilocybin-data__average_cFos-IF__psilcybin_in_HC.nii.gz",
         "color":"place holder for color"
      },
      "Ketamine-data__average_cFos-IF__ket":{
         "name":"Ketamine-data__average_cFos-IF__ket",
         "file":"Ketamine-data__average_cFos-IF__ket.nii.gz",
         "color":"place holder for color"
      },
      "Ketamine-data__valid_clusters_where_NalKet_increased_cFos__q_0.05":{
         "name":"Ketamine-data__valid_clusters_where_NalKet_increased_cFos__q_0.05",
         "file":"Ketamine-data__valid_clusters_where_NalKet_increased_cFos__q_0.05.nii.gz",
         "color":"place holder for color"
      }
   }
}
```

Below an example of a working metadata.json file used during development:

```json
{
    "MDMA (social context) maps": {
        "Experiment Name": "Effect of psilocybin on c-Fos-IF in distinct contexts",
        "Contributor": "Boris Heifets (Stanford University)",
        "Publications": [{
            "link": "https://google.com",
            "label": "UNRAVELing the synergistic effects of psilocybin and environment on brain-wide immediate early gene expression in mice",
            "description": "",
            "keywords": "Rijsketic DR*, Casey AB*, Barbosa DA, Zhang X, Hietamies TM, Ramirez-Ovalle G, Pomrenze MB, Halpern CH, Williams LM, Malenka RC, Heifets BD",
            "tags": [
                "rabbit anti-cfos", "donkey anti-Rabbit Alexa647"
            ]
        }],
        "Treatment/Condition(s)": "psilocybin vs. saline; home cage (HC) vs. enriched environment (EE)",
        "Dose(s)": "psilocybin (2 mg/kg, i.p.); 4-OHT (50 mg/kg; i.p.)",
        "Species, strain, gene(s)": "TRAP2+/-;Ai14+ mice (bred to C57BL/6)",
        "Sample sizes(s)": "n=9 for saline (HC); n = 8 for psilocybin (HC); n = 9 for saline (EE); n = 7 for psilocybin EE",
        "Clearing method": "iDISCO+",
        "Imaging modality": "light sheet fluorescent microscopy (LSFM)",
        "Experiment details": "For TRAPing, mice were injected with 4-OHT and psilocybin or saline. Two-weeks later, mice were again injected with psilocybin or saline (crossover design) and placed in their assigned context for 2 hours before fixation for c-Fos mapping. Brains were hemisected, immunostained, cleared, and imaged in 3D with a Zeiss Lightsheet 7 (2.5x objective; 0.52x zoom; 3.5 isotropic resolution; 10.61 µm sheet thickness). 488 nm light excited autofluorescence (8% of 30 mW; 505-530 nm; 50 ms). 638 nm light excited IF (20% of 75 mW; 660 nm long pass; 50 ms). Pivot scanning limited artifacts. Tiled z-stacks (10% overlap) were stitched in Zen Blue.",
        "Image analysis": [{
            "link": "https://google.com",
            "label": "UNRAVEL Github repository",
            "description": "We developed UNRAVEL to automate c-Fos mapping. Downsampled autofluorescence images were registered (MIRACL) to an iDISCO+/LSFM version of the Allen brain atlas (CCFv3). c-Fos-IF images were rolling ball background subtracted (4-pixel radius), warped to atlas space, z-scored, and smoothed (50 µm). Voxel-wise analyses were performed with randomise_parallel (FSL) according to a 2x2 ANOVA design (6,000 permutations). False positives in F-contrast maps were limited by false discovery rate (FDR) correction and cluster extent (> 100 voxels). Surviving clusters were warped to full resolution tissue space for post hoc cell density comparisons using cell segmentations from Ilastik.",
            "keywords": "",
            "tags": []
        }],
        "Additional links": [{
            "link": "https://google.com",
            "label": "Antibody registry",
            "description": "Documents, documentations and repositories that relates to this experiment.",
            "keywords": "",
            "tags": []
        }]
    },
    "Psilocybin (HC; EE) maps": {
        "Experiment Name": "Effect of psilocybin on c-Fos-IF in distinct contexts",
        "Contributor": "Boris Heifets (Stanford University)",
        "Publications": [{
            "link": "https://google.com",
            "label": "UNRAVELing the synergistic effects of psilocybin and environment on brain-wide immediate early gene expression in mice",
            "description": "",
            "keywords": "Rijsketic DR*, Casey AB*, Barbosa DA, Zhang X, Hietamies TM, Ramirez-Ovalle G, Pomrenze MB, Halpern CH, Williams LM, Malenka RC, Heifets BD",
            "tags": [
                "rabbit anti-cfos", "donkey anti-Rabbit Alexa647"
            ]
        }],
        "Treatment/Condition(s)": "psilocybin vs. saline; home cage (HC) vs. enriched environment (EE)",
        "Dose(s)": "psilocybin (2 mg/kg, i.p.); 4-OHT (50 mg/kg; i.p.)",
        "Species, strain, gene(s)": "TRAP2+/-;Ai14+ mice (bred to C57BL/6)",
        "Sample sizes(s)": "n=9 for saline (HC); n = 8 for psilocybin (HC); n = 9 for saline (EE); n = 7 for psilocybin EE",
        "Clearing method": "iDISCO+",
        "Imaging modality": "light sheet fluorescent microscopy (LSFM)",
        "Experiment details": "For TRAPing, mice were injected with 4-OHT and psilocybin or saline. Two-weeks later, mice were again injected with psilocybin or saline (crossover design) and placed in their assigned context for 2 hours before fixation for c-Fos mapping. Brains were hemisected, immunostained, cleared, and imaged in 3D with a Zeiss Lightsheet 7 (2.5x objective; 0.52x zoom; 3.5 isotropic resolution; 10.61 µm sheet thickness). 488 nm light excited autofluorescence (8% of 30 mW; 505-530 nm; 50 ms). 638 nm light excited IF (20% of 75 mW; 660 nm long pass; 50 ms). Pivot scanning limited artifacts. Tiled z-stacks (10% overlap) were stitched in Zen Blue.",
        "Image analysis": [{
            "link": "https://google.com",
            "label": "UNRAVEL Github repository",
            "description": "We developed UNRAVEL to automate c-Fos mapping. Downsampled autofluorescence images were registered (MIRACL) to an iDISCO+/LSFM version of the Allen brain atlas (CCFv3). c-Fos-IF images were rolling ball background subtracted (4-pixel radius), warped to atlas space, z-scored, and smoothed (50 µm). Voxel-wise analyses were performed with randomise_parallel (FSL) according to a 2x2 ANOVA design (6,000 permutations). False positives in F-contrast maps were limited by false discovery rate (FDR) correction and cluster extent (> 100 voxels). Surviving clusters were warped to full resolution tissue space for post hoc cell density comparisons using cell segmentations from Ilastik.",
            "keywords": "",
            "tags": []
        }],
        "Additional links": [{
            "link": "https://google.com",
            "label": "Antibody registry",
            "description": "Documents, documentations and repositories that relates to this experiment.",
            "keywords": "",
            "tags": []
        }]
    },
    "Ketamine v. Naltrexone+Ket maps": {
        "Experiment Name": "Effect of psilocybin on c-Fos-IF in distinct contexts",
        "Contributor": "Boris Heifets (Stanford University)",
        "Publications": [{
            "link": "https://google.com",
            "label": "UNRAVELing the synergistic effects of psilocybin and environment on brain-wide immediate early gene expression in mice",
            "description": "",
            "keywords": "Rijsketic DR*, Casey AB*, Barbosa DA, Zhang X, Hietamies TM, Ramirez-Ovalle G, Pomrenze MB, Halpern CH, Williams LM, Malenka RC, Heifets BD",
            "tags": [
                "rabbit anti-cfos", "donkey anti-Rabbit Alexa647"
            ]
        }],
        "Treatment/Condition(s)": "psilocybin vs. saline; home cage (HC) vs. enriched environment (EE)",
        "Dose(s)": "psilocybin (2 mg/kg, i.p.); 4-OHT (50 mg/kg; i.p.)",
        "Species, strain, gene(s)": "TRAP2+/-;Ai14+ mice (bred to C57BL/6)",
        "Sample sizes(s)": "n=9 for saline (HC); n = 8 for psilocybin (HC); n = 9 for saline (EE); n = 7 for psilocybin EE",
        "Clearing method": "iDISCO+",
        "Imaging modality": "light sheet fluorescent microscopy (LSFM)",
        "Experiment details": "For TRAPing, mice were injected with 4-OHT and psilocybin or saline. Two-weeks later, mice were again injected with psilocybin or saline (crossover design) and placed in their assigned context for 2 hours before fixation for c-Fos mapping. Brains were hemisected, immunostained, cleared, and imaged in 3D with a Zeiss Lightsheet 7 (2.5x objective; 0.52x zoom; 3.5 isotropic resolution; 10.61 µm sheet thickness). 488 nm light excited autofluorescence (8% of 30 mW; 505-530 nm; 50 ms). 638 nm light excited IF (20% of 75 mW; 660 nm long pass; 50 ms). Pivot scanning limited artifacts. Tiled z-stacks (10% overlap) were stitched in Zen Blue.",
        "Image analysis": [{
            "link": "https://google.com",
            "label": "UNRAVEL Github repository",
            "description": "We developed UNRAVEL to automate c-Fos mapping. Downsampled autofluorescence images were registered (MIRACL) to an iDISCO+/LSFM version of the Allen brain atlas (CCFv3). c-Fos-IF images were rolling ball background subtracted (4-pixel radius), warped to atlas space, z-scored, and smoothed (50 µm). Voxel-wise analyses were performed with randomise_parallel (FSL) according to a 2x2 ANOVA design (6,000 permutations). False positives in F-contrast maps were limited by false discovery rate (FDR) correction and cluster extent (> 100 voxels). Surviving clusters were warped to full resolution tissue space for post hoc cell density comparisons using cell segmentations from Ilastik.",
            "keywords": "",
            "tags": []
        }],
        "Additional links": [{
            "link": "https://google.com",
            "label": "Antibody registry",
            "description": "Documents, documentations and repositories that relates to this experiment.",
            "keywords": "",
            "tags": []
        }]
    }
}
````

#### Create a conda environment and install the required dependencies

Create a conda environment and install all the required dependencies for the ingestion, using the file all_requirements.txt inside the processor folder.

```
conda create --name cfos python=3.9
conda activate cfos
pip install -r all_requirements.txt
```

#### Create the .env and application_default_credentials.json files

Inside the processor folder, create the 2 files .env and application_default_credentials.json

```
cd processor
touch .env
echo "GCLOUD_PROJECT=cfos-visualizer-stanford-dev" > .env
echo "GOOGLE_APPLICATION_CREDENTIALS=./application_default_credentials.json" >> .env
touch application_default_credentials.json
```

To fill the file application_default_credentials.json please contact MetaCell to get the credentials.

### Perform the data ingestion

Once all the preliminaries steps have been performed successfully, the last thing that we have to do is trigger the ingestion itself.

To run this last step ensure to have the conda environment created above activated, and then run the commands below

```
cd processor/
python main.py
```

The ingestion will take some time, which depends on the host machine running the ingestion and the connection/bandwidth used, since the steps performed are:

- preprocess the nifti files to extract the msgpack equivalent, since it's way faster for the viewer to handle these.
- upload all the generated files in the bucket that stores the application data.

# For developers willing to contribute to the codebase - Setup development environment

### Backend

Create a conda environment and install the requirements

```
cd server
conda create --name cfos python=3.9
conda activate cfos
pip install -r requirements.txt
```

Create the files application_default_credentials.json and .env

```
cd server
touch .env
echo "GCLOUD_PROJECT=cfos-visualizer-stanford-dev" > .env
echo "GOOGLE_APPLICATION_CREDENTIALS=./application_default_credentials.json" >> .env
touch application_default_credentials.json
```

run the server with the command

```
python main.py
```

### Frontend

Install all the dependencies required

```
cd client
yarn
```

Run the frontend development server

```
yarn run start
```
