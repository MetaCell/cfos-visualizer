#!/bin/bash

export CLUSTER_NAME=minikube
export NAMESPACE=cfos
export CF_BUILD_ID=latest
export REGISTRY=
export DOMAIN=cfos.local

source ./deploy.sh
