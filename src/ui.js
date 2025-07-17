function openInventory() {
  crafting.style.display = "none"; 

  if (inventoryEl.style.display == 'none') { 
    inventoryEl.style.display = "block"; 
    startingResources.forEach(resource => {
      const el = document.getElementById(`${resource.file}Num`);
      if (el) el.innerHTML = resource.item;
    });
  } else { 
    inventoryEl.style.display = "none"; 
  }
}

// this is such a mess

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
      resourceTxt.innerHTML = item.ingredients[j][1];
      if (resourceInQuestion.item < item.ingredients[j][1]) {
        resourceTxt.style.color = "#c0c0c0";
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