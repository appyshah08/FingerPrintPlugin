/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        FingerprintAuth.isAvailable(isAvailableSuccess, isAvailableError);
        document.getElementById("btnNew").addEventListener("click",callClickFunction);
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function callClickFunction(){ 
    if(isFingerprintEverythinAvailable){
       if(localStorage.getItem("fl")){
          secondLogin();
       }else{
          firstLogin();
       }
    }
    
}

var encryptConfig = {
    clientId: "myAppName",
    username: "cngyzing-2502",
    password: "key123"
};

var isFingerprintEverythinAvailable;

function isAvailableSuccess(result) {
   
    if (result.isAvailable && result.isHardwareDetected && result.hasEnrolledFingerprints) {
       isFingerprintEverythinAvailable = true;
    }else{
          isFingerprintEverythinAvailable = false;
          if(!result.isAvailable){
            alert("Fingerprint is not available");
          }else if(!result.isHardwareDetected){
            alert("Fingerprint hardware not available");
          }else if(!result.hasEnrolledFingerprints){
            alert("Fingerprint is not enrolled");
          }
    }
}
 
function isAvailableError(message) {
    alert("Message "+message);
}

function encryptSuccessCallback(result) {
   // console.log("successCallback(): " + JSON.stringify(result));
    if (result.withFingerprint) {
      //  console.log("Successfully encrypted credentials.");
       // console.log("Encrypted credentials: " + result.token);  
    } else if (result.withBackup) {
       // console.log("Authenticated with backup password");
    }
    localStorage.setItem("fl", true);
    localStorage.setItem("token",result.token);

}

function secondLogin(){
    if(localStorage.getItem("token")){
      var decryptConfig = {
          clientId: "myAppName",
          username: "cngyzing-2502",
          token: localStorage.getItem("token")
       };

       FingerprintAuth.decrypt(decryptConfig, decryptSuccessCallback, decryptErrorCallback);
  }else{
      firstLogin();
  } 
}

function firstLogin(){
   FingerprintAuth.encrypt(encryptConfig, encryptSuccessCallback, encryptErrorCallback);     
}
 
function encryptErrorCallback(error) {
    if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
       // console.log("FingerprintAuth Dialog Cancelled!");
    } else {
        //console.log("FingerprintAuth Error: " + error);
        if(error.toLowerCase().indexOf("fingerprint_not_available")){
            alert("Fingerprint not available");
        }
    }
}


function decryptSuccessCallback(result) {
    // console.log("successCallback(): " + JSON.stringify(result));
    // if (result.withFingerprint) {
    //     //console.log("Successful biometric authentication.");
       
    // } else if (result.withBackup) {
    //     console.log("Authenticated with backup password");
    // }
     if (result.password) {
            console.log("Successfully decrypted credential token.");
            console.log("password: " + result.password);  
        }
}

function decryptErrorCallback(error) {
    if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
        //console.log("FingerprintAuth Dialog Cancelled!");
    } else {
        //console.log("FingerprintAuth Error: " + error);
    }
}

