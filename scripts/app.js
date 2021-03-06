var userInput = document.getElementById('userInput');
var storyDiv = document.getElementById('story');

var firebaseRef = new Firebase('https://storybuilder.firebaseio.com/');
var storyRef = firebaseRef.child('story');

var nodes;
var lastWord;
var inputReady = true;

firebaseRef.authAnonymously(function(error, authData) {
  if (error) {
    console.log(error);
    return;
  } else {
    console.log('authenticated', authData);
  }
}, {
  remember: 'sessionOnly'
});

storyRef.on('child_added', function(childSnapshot) {
  lastWord = childSnapshot;
  var node = document.createElement('span');
  node.appendChild(document.createTextNode(' ' + childSnapshot.val()));

  node.className = 'last';
  nodes = storyDiv.childNodes;
  if (nodes.length) {
    nodes[nodes.length - 1].className = '';
  }

  storyDiv.appendChild(node);
});

storyRef.on('child_removed', function(oldChildSnapshot) {
  storyDiv.removeChild(nodes[nodes.length - 1]);
});

// Grab the first word in the input at post it to Firebase
var submit = function(e) {
  e.preventDefault();

  if (!inputReady) {
    return;
  }

  var input = userInput.value;
  input = input.split(' ')[0];

  storyRef.push(input);

  userInput.value = '';
  inputReady = false;
  userInput.setAttribute('class', 'wait');
  userInput.setAttribute('disabled', 'disabled');
  setTimeout(function() {
    userInput.removeAttribute('class');
    userInput.removeAttribute('disabled');
    userInput.focus();
    inputReady = true;
  }, 1000);
};

var deleteWord = function() {
  if (lastWord) {
    lastWord.ref().remove();
  }
};

document.getElementById('form').addEventListener('submit', submit);
document.getElementById('delete').addEventListener('click', deleteWord);
