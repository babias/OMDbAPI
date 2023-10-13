document.getElementById('verify-button').addEventListener('click', () => {
  const playerName = document.getElementById('name').value;
  const dobEntered = document.getElementById('dob').value;
  
  //empty or has less than 3 characters
  if (playerName.length < 3) {
    document.getElementById('verification-message').textContent = 'Name must be at least 3 characters long.';
    return;
  }
  //if date of birth field is empty
  if (!dobEntered) {
    document.getElementById('verification-message').textContent = 'Please enter your date of birth.';
    return;
  }
  
  // make dob string to a Date object
  const dob = new Date(dobEntered);
  
  //current date
  const currentDate = new Date();
  
  //age
  const age = currentDate.getFullYear() - dob.getFullYear();
  
  // fake due to too old
  if (age > 120) {
    document.getElementById('verification-message').textContent = 'WOW! This is UNREAL!';
    setTimeout(() => {
      //Wikipedia after 3 seconds
      window.location.href = 'https://en.wikipedia.org/wiki/List_of_oldest_living_people';
    }, 3000);
    return;
  }
  //user is at least 16 years old
  if (age >= 16) {
    // goto the game page with name
    window.location.href = `blackjack.html?name=${playerName}`;
  } else {
    // not old enough
    document.getElementById('verification-message').textContent = 'You must be 16 or older to play this game.';
    setTimeout(() => {
      document.getElementById('verification-message').textContent = '';
      //Google after 3 seconds
      window.location.href = 'https://www.google.com';
    }, 3000);
  }
});

