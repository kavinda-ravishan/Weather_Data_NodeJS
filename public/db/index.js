getData();

async function getData() {
  const res = await fetch("/api");
  const dataJson = await res.json();

  for (item of dataJson) {
    const rootDom = document.createElement("p");
    const timeDom = document.createElement("div");
    const locationDom = document.createElement("div");

    timeDom.textContent = `Time : ${new Date(item.Time).toLocaleString()}`;
    locationDom.textContent = `Location : ${item.Latitude}, ${item.Longitude}`;

    rootDom.append(timeDom, locationDom);
    document.body.append(rootDom);
  }
}
