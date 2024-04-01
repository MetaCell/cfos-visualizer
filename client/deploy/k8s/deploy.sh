#!/bin/bash

# set to the correct cluster context and namespace
kubectl config use-context $CLUSTER_NAME
kubectl config set-context $CLUSTER_NAME --namespace=$NAMESPACE

# prep the yamls
cp cfos-visualizer_tpl.yaml cfos-visualizer.yaml
cp ingress_tpl.yaml ingress.yaml

# cfos-visualizer service and deployment
sed -ie 's/{{TAG}}/'$CF_BUILD_ID'/i' cfos-visualizer.yaml
sed -ie 's|{{REGISTRY}}|'$REGISTRY'|i' cfos-visualizer.yaml
kubectl apply -f cfos-visualizer.yaml

# ingress
sed -ie 's|{{DOMAIN}}|'$DOMAIN'|i' ingress.yaml
kubectl apply -f ingress.yaml

# cleanup
rm -rf cfos-visualizer.yaml* ingress.yaml*
