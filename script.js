// 获取DOM元素
const imageUpload = document.getElementById('imageUpload');
const uploadButton = document.getElementById('uploadButton');
const uploadArea = document.getElementById('uploadArea');
const previewImage = document.getElementById('previewImage');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const resetButton = document.getElementById('resetButton');
const confirmButton = document.getElementById('confirmButton');
const finalPreviewImage = document.getElementById('finalPreviewImage');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const downloadButton = document.getElementById('downloadButton');

// 批量处理相关元素
const batchImageUpload = document.getElementById('batchImageUpload');
const batchUploadButton = document.getElementById('batchUploadButton');
const uploadCount = document.getElementById('uploadCount');
const batchImagesContainer = document.getElementById('batchImagesContainer');
const applyAllButton = document.getElementById('applyAllButton');
const downloadAllButton = document.getElementById('downloadAllButton');

// 获取所有滑块和显示值元素
const sliders = document.querySelectorAll('.slider');
const valueDisplays = document.querySelectorAll('.value-display');

// 创建用于编辑的canvas
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let originalImageData = null;

// 存储批量处理的图片
let batchImages = [];
let currentFilterSettings = {};

// 上传图片功能
uploadButton.addEventListener('click', () => {
    imageUpload.click();
});

// 处理图片上传
imageUpload.addEventListener('change', handleImageUpload);

// 批量上传按钮
batchUploadButton.addEventListener('click', () => {
    batchImageUpload.click();
});

// 处理批量图片上传
batchImageUpload.addEventListener('change', () => {
    const files = batchImageUpload.files;
    
    if (files.length > 8) {
        alert('最多只能选择8张图片');
        return;
    }
    
    // 清空现有图片
    batchImages = [];
    batchImagesContainer.innerHTML = '';
    
    // 处理每张图片
    Array.from(files).forEach((file, index) => {
        if (file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                
                img.onload = function() {
                    // 创建新的canvas处理每张图片
                    const imgCanvas = document.createElement('canvas');
                    const imgCtx = imgCanvas.getContext('2d');
                    
                    // 设置canvas尺寸
                    imgCanvas.width = img.width;
                    imgCanvas.height = img.height;
                    
                    // 绘制原始图像
                    imgCtx.drawImage(img, 0, 0, img.width, img.height);
                    
                    // 保存图像数据
                    const imageData = imgCtx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
                    
                    // 添加到批量图片数组
                    batchImages.push({
                        name: file.name,
                        originalImageData: imageData,
                        canvas: imgCanvas,
                        processed: false
                    });
                    
                    // 创建预览元素
                    createBatchImagePreview(e.target.result, index);
                };
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // 更新计数
    uploadCount.textContent = `已选${files.length}张图片`;
});

// 创建批量图片预览
function createBatchImagePreview(src, index) {
    const imageItem = document.createElement('div');
    imageItem.className = 'batch-image-item';
    imageItem.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = `批量图片 ${index + 1}`;
    
    const removeBtn = document.createElement('div');
    removeBtn.className = 'batch-image-remove';
    removeBtn.innerHTML = '✕';
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // 删除图片
        batchImages.splice(index, 1);
        imageItem.remove();
        
        // 更新所有图片的索引
        document.querySelectorAll('.batch-image-item').forEach((item, idx) => {
            item.dataset.index = idx;
        });
        
        // 更新计数
        uploadCount.textContent = `已选${batchImages.length}张图片`;
    });
    
    imageItem.appendChild(img);
    imageItem.appendChild(removeBtn);
    batchImagesContainer.appendChild(imageItem);
}

// 拖放功能
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('active');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('active');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('active');
    
    if (e.dataTransfer.files.length) {
        imageUpload.files = e.dataTransfer.files;
        handleImageUpload();
    }
});

// 处理图片上传
function handleImageUpload() {
    const file = imageUpload.files[0];
    if (!file) return;
    
    // 检查是否为图片
    if (!file.type.match('image.*')) {
        alert('请上传图片文件！');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // 显示预览图片
        previewImage.src = e.target.result;
        previewImage.hidden = false;
        uploadPlaceholder.hidden = true;
        
        // 加载图片到canvas
        const img = new Image();
        img.onload = function() {
            // 设置canvas尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制原始图像
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // 保存原始图像数据
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 重置所有滑块
            resetSliders();
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// 设置滑块和值显示的事件监听
sliders.forEach((slider, index) => {
    slider.addEventListener('input', () => {
        // 更新值显示
        valueDisplays[index].textContent = slider.value;
        
        // 应用滤镜
        if (originalImageData) {
            applyFilters();
        }
    });
});

// 重置按钮
resetButton.addEventListener('click', () => {
    resetSliders();
    if (originalImageData) {
        // 恢复原始图像
        ctx.putImageData(originalImageData, 0, 0);
        updatePreviewFromCanvas();
        
        // 隐藏最终预览
        finalPreviewImage.style.display = 'none';
        previewPlaceholder.style.display = 'block';
    }
});

// 确认按钮 - 显示最终预览
confirmButton.addEventListener('click', () => {
    if (!originalImageData) {
        alert('请先上传图片！');
        return;
    }
    
    // 更新最终预览
    finalPreviewImage.src = canvas.toDataURL('image/png');
    finalPreviewImage.style.display = 'block';
    previewPlaceholder.style.display = 'none';
    
    // 保存当前的滤镜设置
    saveCurrentFilterSettings();
});

// 下载按钮
downloadButton.addEventListener('click', () => {
    if (!originalImageData) {
        alert('请先上传并编辑图片！');
        return;
    }
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// 应用到所有图片按钮
applyAllButton.addEventListener('click', () => {
    if (batchImages.length === 0) {
        alert('请先上传批量图片！');
        return;
    }
    
    if (!Object.keys(currentFilterSettings).length) {
        alert('请先在上方编辑一张图片并点击确定！');
        return;
    }
    
    // 应用当前滤镜设置到所有批量图片
    batchImages.forEach((imgData, index) => {
        const imgCanvas = imgData.canvas;
        const imgCtx = imgCanvas.getContext('2d');
        
        // 复制原始图像数据
        const imageData = new ImageData(
            new Uint8ClampedArray(imgData.originalImageData.data),
            imgData.originalImageData.width,
            imgData.originalImageData.height
        );
        
        // 应用滤镜
        applyImageFilters(imageData, currentFilterSettings);
        
        // 更新canvas
        imgCtx.putImageData(imageData, 0, 0);
        
        // 更新预览
        const previewImg = document.querySelector(`.batch-image-item[data-index="${index}"] img`);
        if (previewImg) {
            previewImg.src = imgCanvas.toDataURL('image/png');
        }
        
        // 标记为已处理
        imgData.processed = true;
    });
    
    alert('滤镜已应用到所有图片！');
});

// 下载所有图片按钮
downloadAllButton.addEventListener('click', () => {
    if (batchImages.length === 0) {
        alert('没有可下载的图片！');
        return;
    }
    
    let processedCount = batchImages.filter(img => img.processed).length;
    
    if (processedCount === 0) {
        if (!confirm('图片尚未进行处理，是否直接下载原图？')) {
            return;
        }
    }
    
    // 依次下载所有图片
    batchImages.forEach((imgData, index) => {
        setTimeout(() => {
            const link = document.createElement('a');
            const imgName = imgData.name.split('.')[0];
            link.download = `${imgName}_edited.png`;
            link.href = imgData.canvas.toDataURL('image/png');
            link.click();
        }, index * 200); // 设置延迟，避免浏览器阻止多个下载
    });
});

// 保存当前滤镜设置
function saveCurrentFilterSettings() {
    currentFilterSettings = {
        dynamicRange: parseInt(document.getElementById('dynamicRange').value),
        highlights: parseInt(document.getElementById('highlights').value),
        shadows: parseInt(document.getElementById('shadows').value),
        vibrance: parseInt(document.getElementById('vibrance').value),
        sharpness: parseInt(document.getElementById('sharpness').value),
        grain: parseInt(document.getElementById('grain').value),
        colorEffect: parseInt(document.getElementById('colorEffect').value),
        blueEffect: parseInt(document.getElementById('blueEffect').value),
        whiteBalance: parseInt(document.getElementById('whiteBalance').value),
        noiseReduction: parseInt(document.getElementById('noiseReduction').value)
    };
}

// 重置所有滑块
function resetSliders() {
    sliders.forEach((slider, index) => {
        if (slider.id === 'dynamicRange' || slider.id === 'sharpness' || 
            slider.id === 'grain' || slider.id === 'colorEffect' || 
            slider.id === 'noiseReduction') {
            slider.value = 0;
        } else {
            slider.value = 0; // 对于可以有负值的滑块，重置为0
        }
        valueDisplays[index].textContent = slider.value;
    });
}

// 应用滤镜
function applyFilters() {
    // 获取滑块值
    const dynamicRange = parseInt(document.getElementById('dynamicRange').value);
    const highlights = parseInt(document.getElementById('highlights').value);
    const shadows = parseInt(document.getElementById('shadows').value);
    const vibrance = parseInt(document.getElementById('vibrance').value);
    const sharpness = parseInt(document.getElementById('sharpness').value);
    const grain = parseInt(document.getElementById('grain').value);
    const colorEffect = parseInt(document.getElementById('colorEffect').value);
    const blueEffect = parseInt(document.getElementById('blueEffect').value);
    const whiteBalance = parseInt(document.getElementById('whiteBalance').value);
    const noiseReduction = parseInt(document.getElementById('noiseReduction').value);
    
    // 从原始图像数据开始
    const imageData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
    );
    
    // 应用滤镜算法
    applyImageFilters(imageData, {
        dynamicRange,
        highlights,
        shadows,
        vibrance,
        sharpness,
        grain,
        colorEffect,
        blueEffect,
        whiteBalance,
        noiseReduction
    });
    
    // 更新canvas
    ctx.putImageData(imageData, 0, 0);
    
    // 更新预览图
    updatePreviewFromCanvas();
}

// 将滤镜应用到图像数据
function applyImageFilters(imageData, filters) {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // 应用白平衡
        if (filters.whiteBalance !== 0) {
            const factor = filters.whiteBalance / 100;
            if (factor > 0) {
                // 偏暖色调
                r += r * factor * 0.2;
                b -= b * factor * 0.2;
            } else {
                // 偏冷色调
                r -= r * Math.abs(factor) * 0.2;
                b += b * Math.abs(factor) * 0.2;
            }
        }
        
        // 应用高光
        if (filters.highlights !== 0) {
            const factor = filters.highlights / 100;
            if (r > 128) r += (255 - r) * factor;
            if (g > 128) g += (255 - g) * factor;
            if (b > 128) b += (255 - b) * factor;
        }
        
        // 应用阴影
        if (filters.shadows !== 0) {
            const factor = filters.shadows / 100;
            if (r < 128) r += r * factor;
            if (g < 128) g += g * factor;
            if (b < 128) b += b * factor;
        }
        
        // 应用色彩
        if (filters.vibrance !== 0) {
            const avg = (r + g + b) / 3;
            const factor = filters.vibrance / 100;
            
            r += (r - avg) * factor;
            g += (g - avg) * factor;
            b += (b - avg) * factor;
        }
        
        // 应用蓝色效果
        if (filters.blueEffect !== 0) {
            const factor = filters.blueEffect / 100;
            b += b * factor;
        }
        
        // 应用色彩效果 (模拟滤镜)
        if (filters.colorEffect > 0) {
            const factor = filters.colorEffect / 100;
            // 模拟复古/怀旧滤镜
            r = r * (1 - 0.3 * factor) + (g * 0.6 + b * 0.3) * factor;
            g = g * (1 - 0.2 * factor) + (r * 0.3 + b * 0.4) * factor;
            b = b * (1 - 0.3 * factor) + (r * 0.3 + g * 0.3) * factor;
        }
        
        // 应用动态范围 (增加对比度)
        if (filters.dynamicRange > 0) {
            const factor = 1 + filters.dynamicRange / 100;
            const avg = 128;
            
            r = avg + (r - avg) * factor;
            g = avg + (g - avg) * factor;
            b = avg + (b - avg) * factor;
        }
        
        // 应用颗粒效果
        if (filters.grain > 0) {
            const noise = (Math.random() - 0.5) * filters.grain;
            r += noise;
            g += noise;
            b += noise;
        }
        
        // 确保值在0-255范围内
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
    }
    
    // 简单实现锐度效果（简化版本）
    if (filters.sharpness > 0) {
        // 这里只是一个简单的模拟锐度效果
        // 实际的锐度算法需要卷积操作，更复杂
        const width = imageData.width;
        const tempData = new Uint8ClampedArray(data);
        const factor = filters.sharpness / 200;
        
        for (let y = 1; y < imageData.height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                // 简单的边缘检测
                for (let c = 0; c < 3; c++) {
                    const current = tempData[idx + c];
                    const left = tempData[idx - 4 + c];
                    const right = tempData[idx + 4 + c];
                    const up = tempData[idx - width * 4 + c];
                    const down = tempData[idx + width * 4 + c];
                    
                    // 计算差值并添加到当前像素
                    const diff = 4 * current - left - right - up - down;
                    data[idx + c] = Math.min(255, Math.max(0, current + diff * factor));
                }
            }
        }
    }
}

// 从canvas更新预览图
function updatePreviewFromCanvas() {
    previewImage.src = canvas.toDataURL('image/png');
}

// 创建上传图标占位符
function createUploadPlaceholder() {
    // 如果没有提供上传图标，创建一个简单的SVG图标
    const iconFolder = './img';
    const iconPath = `${iconFolder}/upload-icon.svg`;
    
    // 检查图标是否存在
    const iconImg = new Image();
    iconImg.onerror = function() {
        // 创建图标文件夹
        const folderRequest = new XMLHttpRequest();
        folderRequest.open('HEAD', iconFolder, true);
        folderRequest.onreadystatechange = function() {
            if (folderRequest.readyState === 4) {
                if (folderRequest.status !== 200) {
                    // 创建一个简单的SVG图标内容
                    const svgContent = `<svg width="60" height="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#888" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                    </svg>`;
                    
                    // 创建一个Blob对象
                    const blob = new Blob([svgContent], {type: 'image/svg+xml'});
                    
                    // 创建一个Blob URL
                    const url = URL.createObjectURL(blob);
                    
                    // 设置上传图标
                    document.querySelector('.upload-icon').src = url;
                }
            }
        };
        folderRequest.send();
    };
    iconImg.src = iconPath;
}

// 页面加载后初始化
window.addEventListener('DOMContentLoaded', () => {
    // 创建上传图标
    createUploadPlaceholder();
    
    // 确保预览区域初始状态
    if (finalPreviewImage) {
        finalPreviewImage.style.display = 'none';
    }
    
    // 检查所有DOM元素是否存在
    console.log('DOM元素检查:');
    console.log('上传按钮:', !!uploadButton);
    console.log('预览图片:', !!previewImage);
    console.log('批量上传按钮:', !!batchUploadButton);
    console.log('批量图片容器:', !!batchImagesContainer);
    console.log('确认按钮:', !!confirmButton);
    console.log('下载按钮:', !!downloadButton);
}); 