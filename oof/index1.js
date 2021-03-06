$(document).ready(function(){
 // Initiating our Auth0Lock
 let lock = new Auth0Lock(
 ‘ndkDOiMwV4cFq6XgY69uI6FNPCx3aV6r’,
 ‘dev-axtcml67.jp.auth0.com’
 {
 auth: {
 params: {
 scope: ‘openid profile’
 } 
 },
 autoclose: true,
 closable: false,
 rememberLastLogin: true
 }
 );
 
 let profile = JSON.parse(localStorage.getItem(‘profile’));
 let isAuthenticated = localStorage.getItem(‘isAuthenticated’);
 
 function updateValues(userProfile, authStatus) {
 profile = userProfile;
 isAuthenticated = authStatus;
 }
 
 if(!isAuthenticated && !window.location.hash){
 lock.show();//show Lock widget
 }
 
 // Listening for the authenticated event
 lock.on(“authenticated”, function(authResult) {
 // Use the token in authResult to getUserInfo() and save it to localStorage
 lock.getUserInfo(authResult.accessToken, function(error, profile) {
 if (error) {
 // Handle error
 return;
 }

 if(!isAuthenticated && !window.location.hash){
  lock.show();
 }
 else{
 
 // Enable pusher logging — don’t include this in production
 Pusher.logToConsole = true;
 
 var pusher = new Pusher(‘APP_SECRET’, {
  cluster: ‘e.g eu’,
  encrypted: false
 });
 
 var channel = pusher.subscribe(‘private-chat’);
  channel.bind(‘message-added’, onMessageAdded); 
 }
 
 function onMessageAdded(data) {
  let template = $(“#new-message”).html();
  template = template.replace(“{{body}}”, data.message);
  template = template.replace(“{{name}}”, data.name);
 
  $(“.chat”).append(template);
 }

 $(‘#btn-chat’).click(function(){
  const message = $(“#message”).val();
  $(“#message”).val(“”);
  //send message
  $.post( “http://localhost:8080/message”, { message, name: profile.name } );
 }); 
 
  $(“#logout”).click((e) => {
  e.preventDefault();
  logout();
 });
 
 function logout(){
   localStorage.clear();
   isAuthenticated = false;
   lock.logout({ 
   returnTo: “http://localhost:8080” 
  });
 }
 
 localStorage.setItem(‘accessToken’, authResult.accessToken);
 localStorage.setItem(‘profile’, JSON.stringify(profile));
 localStorage.setItem(‘isAuthenticated’, true);
 updateValues(profile, true);
 $(“#username”).html(profile.name);
 });
 });
 });