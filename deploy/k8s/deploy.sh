#!/bin/bash

# set to the correct cluster context and namespace
kubectl config use-context $CLUSTER_NAME
kubectl config set-context $CLUSTER_NAME --namespace=$NAMESPACE

# prep the yamls
cp cfos_tpl.yaml cfos.yaml
cp ingress_tpl.yaml ingress.yaml

# sckanner service and deployment
sed -ie 's/{{TAG}}/'$CF_BUILD_ID'/i' cfos.yaml
sed -ie 's|{{REGISTRY}}|'$REGISTRY'|i' cfos.yaml
kubectl apply -f cfos.yaml

# ingress
sed -ie 's|{{DOMAIN}}|'$DOMAIN'|i' ingress.yaml
kubectl apply -f ingress.yaml

# cleanup
rm -rf cfos.yaml* ingress.yaml*
