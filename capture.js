function addInputGroup() {
  const inputContainer = document.getElementById("input-container");
  const newInputGroup = document.createElement("div");
  newInputGroup.className = "input-group space-y-2 flex items-center";
  newInputGroup.innerHTML = `
      <input type="checkbox" class="delete-checkbox mr-2">
      <input type="text" placeholder="URL을 입력하세요" class="url-input block w-full p-2 border border-gray-300 rounded">
      <input type="text" placeholder="텍스트 1" class="text-input block w-full p-2 border border-gray-300 rounded">
      <input type="text" placeholder="텍스트 2" class="text-input block w-full p-2 border border-gray-300 rounded">
  `;
  inputContainer.appendChild(newInputGroup);
}

function deleteSelectedGroups() {
  const inputContainer = document.getElementById("input-container");
  const checkboxes = document.querySelectorAll(".delete-checkbox");

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      inputContainer.removeChild(checkbox.parentElement);
    }
  });
}

function captureImages() {
  const inputGroups = document.querySelectorAll(".input-group");
  const outputContainer = document.getElementById("output-container");
  outputContainer.innerHTML = "";
  let allValid = true;

  inputGroups.forEach((group, index) => {
    const urlInput = group.querySelector(".url-input");
    const textInputs = group.querySelectorAll(".text-input");
    const text1 = textInputs[0].value;
    const text2 = textInputs[1].value;

    if (!urlInput.value) {
      urlInput.classList.add("border-red-500");
      urlInput.placeholder = "값을 입력하세요";
      allValid = false;
    } else {
      urlInput.classList.remove("border-red-500");
      const img = new Image();
      // img.crossOrigin = 'Anonymous'; // crossOrigin 속성 제거
      img.src = urlInput.value;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 1) {
          // 세로가 더 긴 이미지인 경우 경고 메시지 표시
          alert(
            `항목 ${
              index + 1
            }의 이미지가 세로로 더 깁니다. 가로가 더 긴 이미지를 사용하세요.`
          );
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const targetWidth = 860;
        const targetHeight = 500;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // 이미지 크기 조정 및 그리기
        let drawWidth, drawHeight, offsetX, offsetY;

        if (aspectRatio > 1) {
          // 이미지가 가로로 더 긴 경우
          drawWidth = targetWidth;
          drawHeight = targetWidth / aspectRatio;
          offsetX = 0;
          offsetY = (targetHeight - drawHeight) / 2;
        } else {
          // 이미지가 세로로 더 긴 경우
          drawWidth = targetHeight * aspectRatio;
          drawHeight = targetHeight;
          offsetX = (targetWidth - drawWidth) / 2;
          offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // 텍스트를 왼쪽 하단에 그리기
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textBaseline = "bottom";
        ctx.fillText(text1, 10, targetHeight - 40); // 텍스트 1 위치
        ctx.fillText(text2, 10, targetHeight - 10); // 텍스트 2 위치

        // 이미지 캡처 후 PNG로 저장
        const dataURL = canvas.toDataURL("image/png");
        const resultImg = new Image();
        resultImg.src = dataURL;
        outputContainer.appendChild(resultImg);

        // PNG 파일 다운로드 링크 생성
        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = `${text1}.png`;
        downloadLink.textContent = "이미지 다운로드";
        downloadLink.className =
          "mt-2 block bg-blue-500 text-white px-4 py-2 rounded text-center";
        outputContainer.appendChild(downloadLink);
      };
      img.onerror = () => {
        alert(
          `항목 ${
            index + 1
          }의 URL이 유효하지 않습니다. 이미지를 불러올 수 없습니다.`
        );
        allValid = false;
      };
    }
  });

  if (!allValid) {
    alert("URL 입력란에 값을 입력하세요.");
  }
}
