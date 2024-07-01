/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

*/

function codingChalleng1() {
  const getPosition = function () {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  function fetchData() {
    getPosition()
      .then((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("You overused the API. Wait a little bit");
        return res.json();
      })
      .then((data) => {
        if (data.city.split(", ")[0] === "Throttled!")
          throw new Error("You overused the API. Wait a little bit");
        console.log(`You are in ${data.city}, ${data.country}`);
        return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch country data");
        return res.json();
      })
      .then((countryData) => {
        console.log(countryData[0]);
        renderCountry(countryData[0]);
        countriesContainer.style.opacity = 1;
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function whereAmI() {
    await fetchData(52.508, 13.381);
  }
}

// whereAmI();

/*
PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀

*/
// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log("Lottery draw is happening");
//   setTimeout(function () {
//     if (Math.random() >= 0.5) {
//       resolve("You WIN");
//     } else {
//       reject(new Error("you lost"));
//     }
//   }, 0);
// });
// lotteryPromise
//   .then((data) => console.log(data))
//   .catch((data) => console.log(data));

const wait = function (seconds) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, seconds * 1000);
  });
};

// wait(2)
//   .then(() => {
//     setTimeout(() => console.log("I waited for 2 seconds"), 1000);
//     return wait(1);
//   })
//   .then(() => console.log("I waited for 1 second"));

// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. 
When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.
*/
function createImage(imgPath) {
  return new Promise(function (resolve, reject) {
    const newImg = document.createElement("img");
    newImg.src = imgPath;
    newImg.addEventListener("load", (e) => {
      document.querySelector(".images").append(newImg);
      resolve(newImg);
    });
    newImg.addEventListener("error", (e) => {
      reject(new Error("Image cannot be loaded"));
    });
  });
}
const path1 = "./img/img-1.jpg";
const path2 = "./img/img-5.jpg";
function codingChallenge2() {
  let currentImg;
  createImage(path1)
    .then((img) => {
      currentImg = img;
      return wait(2);
    })
    .then(() => {
      currentImg.style.display = "none";
      return createImage(path2);
    })
    .then((img) => {
      currentImg = img;
      return wait(2);
    })
    .then(() => (currentImg.style.display = "none"))
    .catch((err) => console.log(err.message));
}

// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

async function loadNPause() {
  try {
    const img1 = await createImage(path1);
    await wait(2);
    img1.style.display = "none";
    const img2 = await createImage(path2);
    await wait(2);
    img2.style.display = "none";
  } catch (e) {
    console.log(e.message);
  }
}
// loadNPause();

const imgsArray = ["./img/img-1.jpg", "./img/img-2.jpg", "./img/img-3.jpg"];

async function loadAll(...imgArr) {
  try {
    const allPromises = imgArr.map((img) => createImage(img));
    const allImgs = await Promise.all(allPromises);
    allImgs.forEach((img) => img.classList.add("paralell"));
  } catch (e) {
    console.log(e.message);
  }
}

loadAll(...imgsArray);
