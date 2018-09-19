# Load configuration variables
source local.env

function usage() {
  echo -e "Usage: $0 [--install,--uninstall,--env]"
}

function install() {

  echo "Deploy the package"

  npx babel src --out-dir dist
  zip -rq action.zip *
  BOX_CONFIG=$BOX_CONFIG API_KEY=$API_KEY wskdeploy -p .
  
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
