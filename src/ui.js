// this whole file is such a mess
// is there a better way to do it?

// no

function openInventory() {
  const actualInventory = document.getElementById("centered");

  crafting.style.display = "none"; 

  if (inventoryEl.style.display == 'none') inventoryEl.style.display = "block"; 
  else inventoryEl.style.display = "none"; 

  actualInventory.innerHTML = "";

  Object.entries(inventory).forEach(([key, value]) => {
    if (value < 1 && key !== "wood") return;

    const container = document.createElement("div");
    container.classList.add("inventoryContainer");

    const img = document.createElement("img");
    img.classList.add("inventoryImg");
    img.src = itemMap[key].inventory;

    const num = document.createElement("div");
    num.classList.add("inventoryNum");
    num.innerHTML = value;

    container.appendChild(img);
    container.appendChild(num);

    actualInventory.appendChild(container);
  });
}

function openCrafting() {
  if (crafting.style.display == 'none') { 
    crafting.style.display = "block"; 
  } else { 
    crafting.style.display = "none"; 
  }

  let wrapper = crafting.children[0];

  wrapper.innerHTML = "";
  for (i in craftableItems) {
    let item = craftableItems[i];
    
    const idk = document.createElement('div');
    idk.classList.add("inventoryContainer");
    idk.classList.add("recipe");

    const img = document.createElement('img');
    img.classList.add("inventoryImg");
    img.src = item.img;

    const resources = document.createElement('div');
    resources.classList.add('resources');
    for (j in item.ingredients) {
      let resourceInQuestion = item.ingredients[j][0];

      const resource = document.createElement('div');
      resource.classList.add('resourceAmount');

      const resourceImg = document.createElement('img');
      resourceImg.classList.add('necessaryResource');
      resourceImg.src = resourceInQuestion.img;

      const resourceTxt = document.createElement('span');
      if (resourceInQuestion.item < item.ingredients[j][1]) {
        resourceTxt.style.color = "red";
        resourceTxt.innerHTML = resourceInQuestion.item + "/" + item.ingredients[j][1];
      } else {
        resourceTxt.innerHTML = item.ingredients[j][1];
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