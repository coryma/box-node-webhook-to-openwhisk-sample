#!/bin/bash
#
# Copyright 2017-2018 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the “License”);
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#  https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an “AS IS” BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Load configuration variables
source local.env

function usage() {
  echo -e "Usage: $0 [--install,--uninstall,--env]"
}

function install() {

echo "Creating a package"
  bx wsk package create box-webhook-handler \
    --param "BOX_CONFIG" YOUR_BOX_JSON_CONFIG 
  # Exit if any command fails
  set -e

  echo -e "Installing OpenWhisk actions, triggers, and rules for box-webhook-handler..."
  
  npx babel src --out-dir dist
  zip -rq action.zip *
  bx wsk action create box-webhook-handler/hello-box --kind nodejs:6 action.zip --web raw 

  echo -e "Install Complete"
}

function uninstall() {
  echo -e "Uninstalling..."

  echo "Removing API actions..."
  bx wsk action delete box-webhook-handler/hello-box

  echo "Removing package..."
  bx wsk package delete box-webhook-handler

  echo -e "Uninstall Complete"
}



case "$1" in
"--install" )
install
;;
"--uninstall" )
uninstall
;;
* )
usage
;;
esac
