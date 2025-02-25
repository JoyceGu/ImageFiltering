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
const clearImageButton = document.getElementById('clearImageButton');

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

// 获取裁剪相关元素
const cropButton = document.getElementById('cropButton');
const cropOverlay = document.getElementById('cropOverlay');
const cropArea = document.getElementById('cropArea');
const applyCrop = document.getElementById('applyCrop');
const cancelCrop = document.getElementById('cancelCrop');
const cropHandles = document.querySelectorAll('.crop-handle');

// 裁剪相关变量
let isCropping = false;
let isDragging = false;
let isResizing = false;
let currentHandle = null;
let startX = 0;
let startY = 0;
let cropStartX = 0;
let cropStartY = 0;
let cropStartWidth = 0;
let cropStartHeight = 0;

// 模板相关变量
let templates = [];
const API_ENDPOINT = 'http://localhost:3001/api/templates';
const MAX_TEMPLATES = 15;

// 获取模板相关DOM元素
const saveTemplateButton = document.getElementById('saveTemplateButton');
const saveTemplateDialog = document.getElementById('saveTemplateDialog');
const templateName = document.getElementById('templateName');
const confirmSaveTemplate = document.getElementById('confirmSaveTemplate');
const cancelSaveTemplate = document.getElementById('cancelSaveTemplate');
const templatesContainer = document.getElementById('templatesContainer');
const loadingTemplates = document.getElementById('loadingTemplates');
const emptyTemplates = document.getElementById('emptyTemplates');

// 添加语言资源
const translations = {
    zh: {
        title: "网页图片编辑器",
        uploadTitle: "上传图像",
        adjustTitle: "图像调整",
        previewTitle: "处理后预览",
        uploadPlaceholder: "点击或拖拽图片到此处上传",
        selectImage: "选择图片",
        cropButton: "裁剪",
        confirmCrop: "确认裁剪",
        cancel: "取消",
        dynamicRange: "动态范围",
        highlights: "高光",
        shadows: "阴影",
        vibrance: "色彩",
        sharpness: "锐度",
        grain: "颗粒效果",
        colorEffect: "色彩效果",
        blueEffect: "蓝色效果",
        whiteBalance: "白平衡",
        noiseReduction: "高ISO降噪",
        reset: "重置",
        confirm: "确定",
        previewPlaceholder: "编辑效果将在此处预览",
        downloadImage: "下载图片",
        batchTitle: "批量处理图片",
        batchDescription: "上传最多8张图片，一键应用上方设置的编辑参数",
        selectMultiple: "选择多张图片",
        uploadCount: "已选{count}张图片",
        applyAll: "应用编辑到所有图片",
        downloadAll: "下载所有图片",
        dynamicRangeInfo: "调整图像的明暗对比度，增加可使照片更有立体感和层次感",
        highlightsInfo: "调整图像明亮部分的亮度，减小可恢复过曝细节，增加会让亮部更亮",
        shadowsInfo: "调整图像暗部的亮度，增加可以让暗部细节更清晰，减小会让暗部更深邃",
        vibranceInfo: "调整图像的色彩鲜艳程度，增加会让颜色更加生动饱满，减小则更柔和自然",
        sharpnessInfo: "增强图像的边缘清晰度，增加让图像更加清晰锐利，过高可能产生噪点",
        grainInfo: "添加复古胶片般的颗粒感，增加会让图像更有胶片质感",
        colorEffectInfo: "调整图像的色调倾向，增加会让照片更加温暖艳丽",
        blueEffectInfo: "调整图像蓝色色调的强度，正值增加蓝色感，负值增加黄色感",
        whiteBalanceInfo: "调整图像的冷暖色调平衡，正值更冷（偏蓝），负值更暖（偏黄）",
        noiseReductionInfo: "减少图像中的颗粒噪点，使画面更加平滑，过高可能丢失细节",
        saveTemplate: "保存参数模板",
        templatesLibrary: "参数模板库",
        noTemplates: "尚无保存的模板",
        loadingTemplates: "加载模板中...",
        saveTemplateTitle: "保存参数模板",
        templateNamePlaceholder: "输入模板名称",
        save: "保存",
        apply: "应用",
        delete: "删除",
        preset: "预设",
        tooManyTemplates: "模板数量已达上限(15个)",
        errorLoading: "加载模板失败",
        errorSaving: "保存模板失败",
        errorDeleting: "删除模板失败",
        templateNameRequired: "请输入模板名称"
    },
    en: {
        title: "Web Image Editor",
        uploadTitle: "Upload Image",
        adjustTitle: "Image Adjustments",
        previewTitle: "Processed Preview",
        uploadPlaceholder: "Click or Drag Images Here",
        selectImage: "Select Image",
        cropButton: "Crop",
        confirmCrop: "Confirm Crop",
        cancel: "Cancel",
        dynamicRange: "Dynamic Range",
        highlights: "Highlights",
        shadows: "Shadows",
        vibrance: "Vibrance",
        sharpness: "Sharpness",
        grain: "Grain",
        colorEffect: "Color Effect",
        blueEffect: "Blue Effect",
        whiteBalance: "White Balance",
        noiseReduction: "Noise Reduction",
        reset: "Reset",
        confirm: "Confirm",
        previewPlaceholder: "Edit Results Will Preview Here",
        downloadImage: "Download Image",
        batchTitle: "Batch Processing",
        batchDescription: "Upload up to 8 images and apply edits with one click",
        selectMultiple: "Select Multiple Images",
        uploadCount: "{count} images selected",
        applyAll: "Apply Edits to All",
        downloadAll: "Download All",
        dynamicRangeInfo: "Adjusts contrast between light and dark areas, increasing adds more depth and dimension",
        highlightsInfo: "Controls brightness of lighter areas, decreasing recovers overexposed details",
        shadowsInfo: "Controls brightness of darker areas, increasing reveals shadow details, decreasing deepens shadows",
        vibranceInfo: "Adjusts color intensity, increasing makes colors more vivid, decreasing makes them more subtle",
        sharpnessInfo: "Enhances edge clarity, making the image appear more detailed and crisp",
        grainInfo: "Adds film-like grain texture to create a vintage or analog look",
        colorEffectInfo: "Adjusts overall color tone, increasing makes the photo warmer and more vibrant",
        blueEffectInfo: "Controls blue tones, positive values increase blue, negative values add yellow",
        whiteBalanceInfo: "Adjusts color temperature, positive values make image cooler (blue), negative values make it warmer (yellow)",
        noiseReductionInfo: "Reduces grainy noise in the image for a smoother look, too high might lose details",
        saveTemplate: "Save Template",
        templatesLibrary: "Template Library",
        noTemplates: "No saved templates",
        loadingTemplates: "Loading templates...",
        saveTemplateTitle: "Save Template",
        templateNamePlaceholder: "Enter template name",
        save: "Save",
        apply: "Apply",
        delete: "Delete",
        preset: "Preset",
        tooManyTemplates: "Maximum templates reached (15)",
        errorLoading: "Failed to load templates",
        errorSaving: "Failed to save template",
        errorDeleting: "Failed to delete template",
        templateNameRequired: "Please enter a template name"
    }
};

// 当前语言
let currentLang = 'zh';

// 语言切换函数
function switchLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    langSwitch.textContent = currentLang === 'zh' ? 'EN' : '中文';
    
    // 更新页面上的所有文本标签
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    // 更新占位符文本
    const placeholders = document.querySelectorAll('[data-lang-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
    
    // 更新批量上传数量
    updateUploadCount(batchImages.length);
    
    // 强制重新加载模板列表，确保使用正确的语言
    loadTemplates().then(() => {
        console.log('已重新加载模板，当前语言:', currentLang);
    });
    
    // 保存语言偏好
    localStorage.setItem('language', currentLang);
}

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
    updateUploadCount(files.length);
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
        updateUploadCount(batchImages.length);
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
    
    if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // 隐藏上传占位符，显示预览图
            uploadPlaceholder.hidden = true;
            previewImage.hidden = false;
            
            // 设置预览图片
            previewImage.src = e.target.result;
            
            // 显示清除按钮和裁剪按钮
            clearImageButton.hidden = false;
            cropButton.hidden = false; // 确保裁剪按钮显示
            
            // 加载图片到 canvas
            const img = new Image();
            img.onload = function() {
                // 设置 canvas 尺寸
                canvas.width = img.width;
                canvas.height = img.height;
                
                // 绘制图像
                ctx.drawImage(img, 0, 0);
                
                // 保存原始图像数据
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // 预览处理后的图像
                if (applyFilters()) {
                    showPreviewImage();
                }
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
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
    
    // 添加清除按钮事件
    if (clearImageButton) {
        clearImageButton.addEventListener('click', clearUploadedImage);
    }
    
    // 初始化裁剪功能
    initCropEvents();
    
    // 初始化可编辑数值
    initEditableValues();
    
    // 在页面加载时初始化语言切换按钮事件
    const langButton = document.getElementById('langSwitch');
    if (langButton) {
        langButton.addEventListener('click', switchLanguage);
    }

    // 加载模板
    loadTemplates();

    // 添加函数来测试 API 连接
    function testApiConnection() {
        console.log('测试 API 连接:', API_ENDPOINT);
        fetch(API_ENDPOINT)
            .then(response => {
                if (response.ok) {
                    console.log('API 连接成功!');
                    return response.json();
                }
                throw new Error('API 响应错误: ' + response.status);
            })
            .then(data => console.log('获取到模板数量:', data.length))
            .catch(error => console.error('API 连接测试失败:', error));
    }

    // 在页面加载时调用测试
    testApiConnection();
});

// 添加清除图片功能
function clearUploadedImage() {
    // 隐藏预览图片
    previewImage.hidden = true;
    previewImage.src = '';
    
    // 显示上传占位符
    uploadPlaceholder.hidden = false;
    
    // 隐藏清除按钮和裁剪按钮
    clearImageButton.hidden = true;
    cropButton.hidden = true; // 确保裁剪按钮被隐藏
    
    // 重置 canvas 和原始图像数据
    originalImageData = null;
    
    // 清除右侧预览区
    if (finalPreviewImage) {
        finalPreviewImage.style.display = 'none';
    }
    if (previewPlaceholder) {
        previewPlaceholder.style.display = 'block';
    }
    
    // 重置文件输入
    imageUpload.value = '';
    
    // 确保裁剪模式关闭
    endCrop();
}

// 为裁剪功能添加事件监听
function initCropEvents() {
    // 开始裁剪
    cropButton.addEventListener('click', startCrop);
    
    // 确认裁剪
    applyCrop.addEventListener('click', applyCropAction);
    
    // 取消裁剪
    cancelCrop.addEventListener('click', cancelCropAction);
    
    // 移动裁剪区域
    cropArea.addEventListener('mousedown', startDragCropArea);
    
    // 调整裁剪区域大小
    cropHandles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => startResizeCropArea(e, handle));
    });
}

// 开始裁剪
function startCrop() {
    isCropping = true;
    cropOverlay.style.display = 'block';
    
    // 根据图片尺寸初始化裁剪区域
    const imgRect = previewImage.getBoundingClientRect();
    const uploadAreaRect = uploadArea.getBoundingClientRect();
    
    // 设置裁剪区域初始大小为图片尺寸的80%
    const cropWidth = imgRect.width * 0.8;
    const cropHeight = imgRect.height * 0.8;
    
    // 居中裁剪框
    const cropLeft = (imgRect.width - cropWidth) / 2;
    const cropTop = (imgRect.height - cropHeight) / 2;
    
    // 设置裁剪区域样式
    cropArea.style.width = `${cropWidth}px`;
    cropArea.style.height = `${cropHeight}px`;
    cropArea.style.left = `${cropLeft}px`;
    cropArea.style.top = `${cropTop}px`;
    
    // 添加拖动和调整大小事件
    document.addEventListener('mousemove', moveCropArea);
    document.addEventListener('mouseup', stopCropAction);
}

// 开始拖动裁剪区域
function startDragCropArea(e) {
    if (!isCropping) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    isResizing = false;
    
    startX = e.clientX;
    startY = e.clientY;
    cropStartX = parseInt(cropArea.style.left || 0);
    cropStartY = parseInt(cropArea.style.top || 0);
}

// 开始调整裁剪区域大小
function startResizeCropArea(e, handle) {
    if (!isCropping) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isResizing = true;
    isDragging = false;
    currentHandle = handle;
    
    startX = e.clientX;
    startY = e.clientY;
    cropStartX = parseInt(cropArea.style.left || 0);
    cropStartY = parseInt(cropArea.style.top || 0);
    cropStartWidth = parseInt(cropArea.style.width);
    cropStartHeight = parseInt(cropArea.style.height);
}

// 移动裁剪区域
function moveCropArea(e) {
    if (!isCropping) return;
    
    e.preventDefault();
    
    if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // 计算新位置
        let newLeft = cropStartX + dx;
        let newTop = cropStartY + dy;
        
        // 限制在图片范围内
        const imgRect = previewImage.getBoundingClientRect();
        const cropWidth = parseInt(cropArea.style.width);
        const cropHeight = parseInt(cropArea.style.height);
        
        newLeft = Math.max(0, Math.min(imgRect.width - cropWidth, newLeft));
        newTop = Math.max(0, Math.min(imgRect.height - cropHeight, newTop));
        
        // 应用新位置
        cropArea.style.left = `${newLeft}px`;
        cropArea.style.top = `${newTop}px`;
    } else if (isResizing && currentHandle) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // 根据当前操作的手柄调整大小和位置
        if (currentHandle.classList.contains('tl')) {
            // 左上角
            let newWidth = cropStartWidth - dx;
            let newHeight = cropStartHeight - dy;
            let newLeft = cropStartX + dx;
            let newTop = cropStartY + dy;
            
            if (newWidth > 20 && newHeight > 20) {
                cropArea.style.width = `${newWidth}px`;
                cropArea.style.height = `${newHeight}px`;
                cropArea.style.left = `${newLeft}px`;
                cropArea.style.top = `${newTop}px`;
            }
        } else if (currentHandle.classList.contains('tr')) {
            // 右上角
            let newWidth = cropStartWidth + dx;
            let newHeight = cropStartHeight - dy;
            let newTop = cropStartY + dy;
            
            if (newWidth > 20 && newHeight > 20) {
                cropArea.style.width = `${newWidth}px`;
                cropArea.style.height = `${newHeight}px`;
                cropArea.style.top = `${newTop}px`;
            }
        } else if (currentHandle.classList.contains('bl')) {
            // 左下角
            let newWidth = cropStartWidth - dx;
            let newHeight = cropStartHeight + dy;
            let newLeft = cropStartX + dx;
            
            if (newWidth > 20 && newHeight > 20) {
                cropArea.style.width = `${newWidth}px`;
                cropArea.style.height = `${newHeight}px`;
                cropArea.style.left = `${newLeft}px`;
            }
        } else if (currentHandle.classList.contains('br')) {
            // 右下角
            let newWidth = cropStartWidth + dx;
            let newHeight = cropStartHeight + dy;
            
            if (newWidth > 20 && newHeight > 20) {
                cropArea.style.width = `${newWidth}px`;
                cropArea.style.height = `${newHeight}px`;
            }
        }
    }
}

// 停止裁剪操作
function stopCropAction() {
    isDragging = false;
    isResizing = false;
    currentHandle = null;
}

// 应用裁剪
function applyCropAction() {
    if (!isCropping) return;
    
    // 获取裁剪区域的位置和大小
    const cropRect = cropArea.getBoundingClientRect();
    const imgRect = previewImage.getBoundingClientRect();
    
    // 计算裁剪坐标相对于图像的比例
    const scaleX = originalImageData.width / imgRect.width;
    const scaleY = originalImageData.height / imgRect.height;
    
    // 计算要裁剪的区域在原始图像上的坐标和大小
    const sourceX = (cropRect.left - imgRect.left) * scaleX;
    const sourceY = (cropRect.top - imgRect.top) * scaleY;
    const sourceWidth = cropRect.width * scaleX;
    const sourceHeight = cropRect.height * scaleY;
    
    // 创建新的canvas来存储裁剪后的图像
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    
    // 设置canvas尺寸
    cropCanvas.width = sourceWidth;
    cropCanvas.height = sourceHeight;
    
    // 从原始图像数据中裁剪
    const imageData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
    );
    
    // 创建临时canvas来绘制原始图像
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = originalImageData.width;
    tempCanvas.height = originalImageData.height;
    tempCtx.putImageData(imageData, 0, 0);
    
    // 裁剪图像
    cropCtx.drawImage(
        tempCanvas,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, sourceWidth, sourceHeight
    );
    
    // 更新原始canvas尺寸和内容
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    ctx.drawImage(cropCanvas, 0, 0);
    
    // 更新原始图像数据
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // 应用当前滤镜
    applyFilters();
    
    // 更新预览图
    previewImage.src = canvas.toDataURL('image/png');
    
    // 关闭裁剪界面
    endCrop();
}

// 取消裁剪
function cancelCropAction() {
    endCrop();
}

// 结束裁剪模式
function endCrop() {
    isCropping = false;
    cropOverlay.style.display = 'none';
    
    // 移除事件监听
    document.removeEventListener('mousemove', moveCropArea);
    document.removeEventListener('mouseup', stopCropAction);
}

// 添加双击编辑数字的功能
function initEditableValues() {
    const valueDisplays = document.querySelectorAll('.value-display');
    
    valueDisplays.forEach((display, index) => {
        // 双击数字开始编辑
        display.addEventListener('dblclick', function() {
            const currentValue = parseInt(this.textContent);
            const slider = document.querySelectorAll('.slider')[index];
            
            // 创建输入框
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'value-display-edit';
            input.value = currentValue;
            input.min = slider.min;
            input.max = slider.max;
            
            // 替换显示为输入框
            this.parentNode.replaceChild(input, this);
            input.focus();
            input.select();
            
            // 处理输入完成
            function completeEdit() {
                let newValue = parseInt(input.value);
                
                // 验证输入值是否在有效范围内
                newValue = Math.max(parseInt(slider.min), Math.min(parseInt(slider.max), newValue));
                
                // 更新滑块值
                slider.value = newValue;
                
                // 创建新的显示元素
                const newDisplay = document.createElement('span');
                newDisplay.className = 'value-display';
                newDisplay.textContent = newValue;
                
                // 替换回显示元素
                input.parentNode.replaceChild(newDisplay, input);
                
                // 重新初始化事件监听
                initEditableValues();
                
                // 触发滑块的input事件以应用更改
                const event = new Event('input', { bubbles: true });
                slider.dispatchEvent(event);
            }
            
            // 处理按键事件
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    completeEdit();
                    e.preventDefault();
                } else if (e.key === 'Escape') {
                    // 取消编辑，恢复原值
                    const newDisplay = document.createElement('span');
                    newDisplay.className = 'value-display';
                    newDisplay.textContent = currentValue;
                    input.parentNode.replaceChild(newDisplay, input);
                    initEditableValues();
                    e.preventDefault();
                }
            });
            
            // 失去焦点时完成编辑
            input.addEventListener('blur', completeEdit);
        });
    });
}

// 修改批量上传代码以支持语言切换
function updateUploadCount(count) {
    const uploadCount = document.getElementById('uploadCount');
    if (uploadCount) {
        const template = translations[currentLang].uploadCount;
        uploadCount.textContent = template.replace('{count}', count);
    }
}

// 保存模板按钮点击事件
saveTemplateButton.addEventListener('click', () => {
    if (!originalImageData) {
        alert(translations[currentLang].noImageUploaded || '请先上传并编辑图片！');
        return;
    }
    
    // 检查模板数量是否达到上限
    const userTemplates = templates.filter(t => !t.preset);
    if (userTemplates.length >= MAX_TEMPLATES) {
        alert(translations[currentLang].tooManyTemplates);
        return;
    }
    
    // 显示保存模板对话框
    saveTemplateDialog.style.display = 'block';
    templateName.value = `模板 ${userTemplates.length + 1}`;
    templateName.focus();
    templateName.select();
});

// 确认保存模板
confirmSaveTemplate.addEventListener('click', async () => {
    if (!templateName.value.trim()) {
        alert(translations[currentLang].templateNameRequired || '请输入模板名称');
        return;
    }
    
    // 构建新模板对象，对用户模板名称不做多语言处理
    const newTemplate = {
        name: templateName.value.trim(),
        params: getCurrentParams()
    };
    
    // 保存到服务器
    await saveTemplateToServer(newTemplate);
    
    // 关闭对话框并清空输入框
    saveTemplateDialog.style.display = 'none';
    templateName.value = '';
});

// 取消保存模板
cancelSaveTemplate.addEventListener('click', () => {
    saveTemplateDialog.style.display = 'none';
});

// 点击模态对话框外部关闭
window.addEventListener('click', (e) => {
    if (e.target === saveTemplateDialog) {
        saveTemplateDialog.style.display = 'none';
    }
});

// 加载模板
async function loadTemplates() {
    loadingTemplates.style.display = 'block';
    emptyTemplates.style.display = 'none';
    templatesContainer.innerHTML = '';
    templatesContainer.appendChild(loadingTemplates);
    
    try {
        console.log('正在请求API:', API_ENDPOINT);
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('成功获取模板数据:', data.length, '个模板');
        console.log('第一个模板名称格式:', typeof data[0].name, data[0].name);
        templates = data;
        
        renderTemplates();
        return data;
    } catch (error) {
        console.error('加载模板失败:', error);
        loadingTemplates.textContent = translations[currentLang].errorLoading + ' - ' + error.message;
        return [];
    }
}

// 保存模板到服务器
async function saveTemplateToServer(template) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(template)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const savedTemplate = await response.json();
        
        // 更新本地模板列表
        const userTemplates = templates.filter(t => !t.preset);
        templates = [...templates.filter(t => t.preset), ...userTemplates, savedTemplate];
        
        renderTemplates();
    } catch (error) {
        console.error('保存模板失败:', error);
        alert(translations[currentLang].errorSaving);
    }
}

// 从服务器删除模板
async function deleteTemplateFromServer(id) {
    try {
        const response = await fetch(`${API_ENDPOINT}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 更新本地模板列表
        templates = templates.filter(t => t.id !== id);
        
        renderTemplates();
    } catch (error) {
        console.error('删除模板失败:', error);
        alert(translations[currentLang].errorDeleting);
    }
}

// 渲染模板列表
function renderTemplates() {
    // 移除加载提示
    loadingTemplates.style.display = 'none';
    
    // 清空容器
    templatesContainer.innerHTML = '';
    
    if (templates.length === 0) {
        // 显示空状态
        emptyTemplates.style.display = 'block';
        templatesContainer.appendChild(emptyTemplates);
        return;
    }
    
    // 先显示预设模板，后显示用户模板
    const presetTemplates = templates.filter(t => t.preset);
    const userTemplates = templates.filter(t => !t.preset);
    
    // 创建模板项
    [...presetTemplates, ...userTemplates].forEach(template => {
        const item = document.createElement('div');
        item.className = template.preset ? 'template-item preset' : 'template-item';
        
        const nameElem = document.createElement('div');
        nameElem.className = 'template-name';
        
        // 调试输出
        console.log(`渲染模板: ${template.id}, 名称类型: ${typeof template.name}`);
        if (typeof template.name === 'object') {
            console.log(`  语言选项: ${Object.keys(template.name).join(', ')}`);
            console.log(`  当前语言: ${currentLang}, 显示: ${template.name[currentLang]}`);
        }
        
        // 处理多语言模板名称
        if (template.name && typeof template.name === 'object') {
            // 预设模板使用当前语言的名称
            nameElem.textContent = template.name[currentLang] || template.name.zh || template.name.en || '未命名';
        } else {
            // 用户模板或字符串名称
            nameElem.textContent = template.name || '未命名';
        }
        
        // 添加预设标记的代码保持不变
        if (template.preset) {
            const presetBadge = document.createElement('span');
            presetBadge.className = 'preset-badge';
            presetBadge.textContent = translations[currentLang].preset || '预设';
            nameElem.appendChild(presetBadge);
        }
        
        const actions = document.createElement('div');
        actions.className = 'template-actions';
        
        // 应用按钮
        const applyBtn = document.createElement('button');
        applyBtn.className = 'template-apply';
        applyBtn.textContent = translations[currentLang].apply || '应用';
        applyBtn.addEventListener('click', () => applyTemplate(template));
        
        // 只为用户模板添加删除按钮
        if (!template.preset) {
            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'template-delete';
            deleteBtn.textContent = translations[currentLang].delete || '删除';
            deleteBtn.addEventListener('click', () => {
                const confirmMessage = currentLang === 'zh' 
                    ? `确定要删除模板 "${template.name[currentLang] || template.name}" 吗？`
                    : `Are you sure you want to delete template "${template.name[currentLang] || template.name}"?`;
                
                if (confirm(confirmMessage)) {
                    deleteTemplateFromServer(template.id);
                }
            });
            
            actions.appendChild(deleteBtn);
        }
        
        // 添加应用按钮
        actions.appendChild(applyBtn);
        
        item.appendChild(nameElem);
        item.appendChild(actions);
        
        templatesContainer.appendChild(item);
    });
}

// 应用模板
function applyTemplate(template) {
    if (!originalImageData) {
        alert(translations[currentLang].noImageUploaded || '请先上传图片！');
        return;
    }
    
    // 应用参数
    sliders.forEach(slider => {
        if (template.params[slider.id] !== undefined) {
            slider.value = template.params[slider.id];
            // 更新显示值
            const index = Array.from(sliders).indexOf(slider);
            if (valueDisplays[index]) {
                valueDisplays[index].textContent = slider.value;
            }
        }
    });
    
    // 应用滤镜
    applyFilters();
} 