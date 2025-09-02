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
    img.src = itemMap[key].inventory;

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

function openCrafting() {
  if (ui.crafting.style.display == 'none') { 
    ui.crafting.style.display = "block"; 
  } else { 
    ui.crafting.style.display = "none"; 
  }

  let wrapper = ui.crafting.children[0];

  wrapper.innerHTML = "";
  for (i in state.unlockedRecipes) {
    let item = state.unlockedRecipes[i];
    
    const idk = document.createElement('div');
    idk.classList.add("inventoryContainer");
    idk.classList.add("recipe");
    idk.onclick = () => { craftItem(item) }

    const img = document.createElement('img');
    img.classList.add("inventoryImg");
    img.src = item.inventory;

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