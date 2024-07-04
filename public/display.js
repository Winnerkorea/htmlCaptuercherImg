function addInputGroup() {
  const inputContainer = document.getElementById("input-container");
  const newInputGroup = document.createElement("div");
  newInputGroup.className = "input-group space-y-2";
  newInputGroup.innerHTML = `
      <input type="text" placeholder="URL을 입력하세요" class="url-input block w-full p-2 border border-gray-300 rounded">
      <input type="text" placeholder="텍스트 1" class="text-input block w-full p-2 border border-gray-300 rounded">
      <input type="text" placeholder="텍스트 2" class="text-input block w-full p-2 border border-gray-300 rounded">
      <button class="delete-btn bg-red-500 text-white px-4 py-2 rounded" onclick="deleteInputGroup(this)">삭제</button>
  `;
  inputContainer.appendChild(newInputGroup);
}

function deleteInputGroup(button) {
  const inputContainer = document.getElementById("input-container");
  inputContainer.removeChild(button.parentElement);
}

function displayImages() {
  const inputGroups = document.querySelectorAll(".input-group");
  const outputContainer = document.getElementById("output-container");
  outputContainer.innerHTML = ""; // 기존 출력 내용을 초기화

  inputGroups.forEach((group, index) => {
    const urlInput = group.querySelector(".url-input").value;
    const text1Input = group.querySelector(".text-input:nth-of-type(2)").value;
    const text2Input = group.querySelector(".text-input:nth-of-type(3)").value;

    if (urlInput) {
      const imgContainer = document.createElement("div");
      imgContainer.className =
        "relative bg-gray-200 flex items-center justify-center";
      imgContainer.style.width = "800px";
      imgContainer.style.height = "600px";

      const outputImage = document.createElement("img");
      outputImage.src = urlInput;
      outputImage.className = "absolute w-full h-full object-cover";
      outputImage.style.width = "800px";
      outputImage.style.height = "600px";

      const textContainer = document.createElement("div");
      textContainer.className = "absolute text-center";
      textContainer.style.top = "50%";
      textContainer.style.left = "50%";
      textContainer.style.transform = "translate(-50%, -50%)";
      textContainer.style.color = "white";
      textContainer.style.opacity = "0.5"; // 투명도 50%
      textContainer.style.lineHeight = "1";

      const text1 = document.createElement("div");
      text1.textContent = text1Input;
      text1.className = "text-lg";
      text1.style.fontSize = "25px";
      text1.style.fontWeight = "600"; // font-weight 600

      const text2 = document.createElement("div");
      text2.textContent = text2Input;
      text2.className = "text-lg";
      text2.style.fontSize = "25px";

      textContainer.appendChild(text1);
      textContainer.appendChild(text2);

      imgContainer.appendChild(outputImage);
      imgContainer.appendChild(textContainer);

      imgContainer.id = `capture-container-${index}`;

      outputContainer.appendChild(imgContainer);
    }
  });
}

function captureImages() {
  const imgContainers = document.querySelectorAll("#output-container > div");
  imgContainers.forEach((container, index) => {
    fetch("/capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: container.outerHTML,
        index: index + 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const link = document.createElement("a");
          link.href = data.filePath;
          link.download = `capture_${index + 1}.png`;
          link.click();
        } else {
          alert("이미지 캡처에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("캡처 오류:", error);
      });
  });
}

function resetInputs() {
  const inputContainer = document.getElementById("input-container");
  inputContainer.innerHTML = `
      <div class="input-group space-y-2">
          <input type="text" placeholder="URL을 입력하세요" class="url-input block w-full p-2 border border-gray-300 rounded">
          <input type="text" placeholder="텍스트 1" class="text-input block w-full p-2 border border-gray-300 rounded">
          <input type="text" placeholder="텍스트 2" class="text-input block w-full p-2 border border-gray-300 rounded">
          <button class="delete-btn bg-red-500 text-white px-4 py-2 rounded" onclick="deleteInputGroup(this)">삭제</button>
      </div>
  `;
  document.getElementById("output-container").innerHTML = ""; // 출력 컨테이너 초기화
}
