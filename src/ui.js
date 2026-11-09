// this whole file is such a mess
// is there a better way to do it?

// no

function openInventory() {
  const actualInventory = document.getElementById("centered");

  ui.crafting.style.display = "none";

  if (ui.inventory.style.display == 'none') ui.inventory.style.display = "block";
  else ui.inventory.style.display = "none";

  actualInventory.innerHTML = "";

  let useless = true;
  Object.entries(inventory).forEach(([key, value]) => {
    if (value < 1) return;

    useless = false;

    const container = document.createElement("div");
    container.classList.add("inventoryContainer");
    container.onclick = (() => { useItem(itemMap[key]); })

    const img = document.createElement("img");
    img.classList.add("inventoryImg");
    img.src = itemMap[key].assets.inventory;

    const num = document.createElement("div");
    num.classList.add("inventoryNum");
    num.innerHTML = value;

    container.appendChild(img);
    container.appendChild(num);

    actualInventory.appendChild(container);
  });

  if (useless) {
    ui.inventory.style.display = "none";
  }
}

function openCrafting(toggle = true) {
  if (toggle) {
    ui.crafting.style.display = ui.crafting.style.display === 'none' ? "block" : "none";
  }

  let wrapper = ui.crafting.children[0];

  wrapper.innerHTML = "";
  for (const item of state.unlockedRecipes) {

    const idk = document.createElement('div');
    idk.classList.add("inventoryContainer");
    idk.classList.add("recipe");
    idk.onclick = () => { craftItem(item) }

    const img = document.createElement('img');
    img.classList.add("inventoryImg");
    img.src = item.assets.inventory;

    const resources = document.createElement('div');
    resources.classList.add('resources');
    for (const [resourceInQuestion, amount] of item.ingredients) {

      const resource = document.createElement('div');
      resource.classList.add('resourceAmount');

      const resourceImg = document.createElement('img');
      resourceImg.classList.add('necessaryResource');
      resourceImg.src = resourceInQuestion.assets.pickup;

      const resourceTxt = document.createElement('span');
      if (resourceInQuestion.item < amount) {
        resourceTxt.style.color = "red";
        resourceTxt.innerHTML = resourceInQuestion.item + "/" + amount;
      } else {
        resourceTxt.innerHTML = amount;
      }

      resource.appendChild(resourceImg);
      resource.appendChild(resourceTxt);

      resources.appendChild(resource);
    }

    idk.appendChild(img);
    idk.appendChild(resources);

    wrapper.appendChild(idk);
  }
}
function toggleSettings() {
  const settings = document.getElementById("settings");
  const btn = document.getElementById("settingsbutton");

  if (settings.style.display == "block") {
    settings.style.display = "none";
    btn.src = "res/img/buttons/settings.png";
  } else {
    settings.style.display = "block";
    btn.src = "res/img/buttons/settingsOpen.png";
  }
}
function toggleScanlines() {
  const scanlines = document.getElementsByClassName("overlay")[0];
  const scanlinesquestionmark = document.getElementById("scanlinesquestionmark");

  if (scanlinesquestionmark.checked) {
    scanlines.style.display = "block";
  } else {
    scanlines.style.display = "none";
  }
}
function setMasterVolume(value) {
  globals.volume = value;
  ui.gain.gain.value = globals.volume;

}
