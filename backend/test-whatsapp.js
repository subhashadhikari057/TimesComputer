const url = "https://wa.me/9779761657579?text=%F0%9F%9B%92%20BULK%20ORDER%20INQUIRY%0A%0AProduct%3A%20Apple%20MacBook%20Pro%2016-inch%20M3%20Pro%20(2024)%0AQuantity%3A%205%20units%0AUnit%20Price%3A%20Rs%202%2C00%2C000%0AEstimated%20Total%3A%20Rs%2010%2C00%2C000%0APreferred%20Color%3A%20Silver%0A%0AKey%20Specifications%3A%0A%E2%80%A2%20Ports%3A%203x%20Thunderbolt%204%2C%20HDMI%2C%20SDXC%2C%20MagSafe%203%0A%E2%80%A2%20Camera%09%3A%201080p%20FaceTime%20HD%0A%E2%80%A2%20Resolution%09%3A%203456%20x%202234%20pixels%0A%E2%80%A2%20Battery%20Life%09%3A%20Up%20to%2022%20hours%0A%E2%80%A2%20Display%20Size%09%3A%2016.2%20inches%0A%0APlease%20provide%3A%0A%E2%80%A2%20Best%20bulk%20pricing%20for%205%20units%0A%E2%80%A2%20Delivery%20timeline%20and%20shipping%20costs%0A%E2%80%A2%20Payment%20terms%20and%20options%0A%E2%80%A2%20Warranty%20and%20support%20details%0A%0ALooking%20forward%20to%20your%20response.%20Thank%20you!";

console.log("Full URL:", url);
console.log("\nDecoded message:");
const message = decodeURIComponent(url.split('text=')[1]);
console.log(message);
console.log("\nMessage length:", message.length);
