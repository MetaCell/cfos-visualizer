#!/bin/bash

export CLUSTER_NAME=minikube
export NAMESPACE=cfos-visualizer
export CF_BUILD_ID=latest
export REGISTRY=
export DOMAIN=cfos-visualizer.local

source ./deploy.sh
