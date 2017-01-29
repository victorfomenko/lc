var loginModalLink =    'modal-login',
  registerModalLink = 'modal-register';

var hash = $location.hash();
if (hash == loginModalLink) {
  $('#' + loginModalLink).modal('show');
  $('#' + registerModalLink).modal('hide');
}
else if (hash == registerModalLink) {
  $('#' + registerModalLink).modal('show');
  $('#' + loginModalLink).modal('hide');
}
else if(!hash) {
  $('#' + loginModalLink).modal('hide');
  $('#' + registerModalLink).modal('hide');
}

export function login() {

}