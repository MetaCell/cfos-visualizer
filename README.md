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

Inside the data folder create 2 more folders, one to store all the activity maps (ActivityMap) )and one to store all the atlases (Atlas).

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

#### Prepare the index.json inside the data folder

It is responsability of the user triggering the ingestion also to prepare a file, **named index.json and placed inside the data folder**, that contains the hierarchical structure of the experiments and the data, according to the data model documented for the project.

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
echo "GCLOUD_PROJECT=cfos-visualizer-stanford" > .env
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

- preprocess the nifti files to extract the msgpack equivalent, since it's way faster for the viewer handle these.
- generate the wireframe for each atlas file.
- upload all the generated files in the bucket that stores the application data.

## Setup development environment

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
echo "GCLOUD_PROJECT=cfos-visualizer-stanford" > .env
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
