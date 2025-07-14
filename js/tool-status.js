// 工具状态检查和维护信息显示
(function() {
    // 工具路径映射到ID
    const toolPathToId = {
        'tool/calculator.html': 1,
        'tool/unit_converter.html': 2,
        'tool/timestamp_converter.html': 3,
        'tool/color_picker.html': 4,
        'tool/json_formatter.html': 5,
        'tool/password_generator.html': 6,
        'tool/qrcode_generator.html': 7,
        'tool/text_case_converter.html': 8,
        'tool/image_compressor.html': 9,
        'tool/pdf_tools.html': 10,
        'tool/date_calculator.html': 11,
        'tool/random_generator.html': 12
    };
    
    // 获取当前页面路径
    function getCurrentPath() {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts.slice(-2).join('/');
    }
    
    // 检查工具状态
    function checkToolStatus() {
        const currentPath = getCurrentPath();
        const toolId = toolPathToId[currentPath];
        
        if (!toolId) return;
        
        const savedStatus = localStorage.getItem('dreamirage_tools_status');
        if (!savedStatus) return;
        
        try {
            const statusData = JSON.parse(savedStatus);
            const toolStatus = statusData.find(item => item.id === toolId);
            
            if (toolStatus && (toolStatus.status === 'maintenance' || toolStatus.status === 'development')) {
                showMaintenanceMessage(toolStatus.status);
                return true;
            }
        } catch (e) {
            console.error('Error checking tool status:', e);
        }
        
        return false;
    }
    
    // 显示维护或开发中消息
    function showMaintenanceMessage(status) {
        // 获取保存的消息
        let message = localStorage.getItem('dreamirage_maintenance_message') || 
            '很抱歉，该工具目前正在维护/开发中，暂时无法使用。请稍后再试或联系管理员获取更多信息。';
        
        // 替换状态文本
        message = message.replace('维护/开发中', status === 'maintenance' ? '维护中' : '开发中');
        
        // 创建遮罩和消息容器
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        
        const messageBox = document.createElement('div');
        messageBox.style.maxWidth = '500px';
        messageBox.style.backgroundColor = '#fff';
        messageBox.style.borderRadius = '10px';
        messageBox.style.padding = '30px';
        messageBox.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        messageBox.style.textAlign = 'center';
        
        // 设置标题和消息
        const icon = document.createElement('i');
        icon.className = status === 'maintenance' ? 'fas fa-wrench' : 'fas fa-code-branch';
        icon.style.fontSize = '48px';
        icon.style.color = status === 'maintenance' ? '#ff5252' : '#ffab00';
        icon.style.marginBottom = '20px';
        
        const title = document.createElement('h2');
        title.textContent = status === 'maintenance' ? '工具维护中' : '工具开发中';
        title.style.fontSize = '24px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '15px';
        title.style.color = '#333';
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.fontSize = '16px';
        messageText.style.color = '#666';
        messageText.style.lineHeight = '1.6';
        messageText.style.marginBottom = '25px';
        
        const backButton = document.createElement('a');
        backButton.href = '../index.html';
        backButton.textContent = '返回首页';
        backButton.style.display = 'inline-block';
        backButton.style.padding = '10px 20px';
        backButton.style.backgroundColor = '#4361ee';
        backButton.style.color = '#fff';
        backButton.style.borderRadius = '5px';
        backButton.style.textDecoration = 'none';
        backButton.style.fontWeight = 'bold';
        backButton.style.transition = 'background-color 0.3s';
        
        backButton.onmouseover = function() {
            this.style.backgroundColor = '#3a51d6';
        };
        
        backButton.onmouseout = function() {
            this.style.backgroundColor = '#4361ee';
        };
        
        // 组装消息框
        messageBox.appendChild(icon);
        messageBox.appendChild(title);
        messageBox.appendChild(messageText);
        messageBox.appendChild(backButton);
        overlay.appendChild(messageBox);
        
        // 添加到页面
        document.body.appendChild(overlay);
        
        // 阻止页面内容加载和交互
        document.body.style.overflow = 'hidden';
        
        // 遮挡所有其他内容
        const allElements = document.body.children;
        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i] !== overlay) {
                allElements[i].style.display = 'none';
            }
        }
    }
    
    // 页面加载时检查状态
    window.addEventListener('DOMContentLoaded', function() {
        checkToolStatus();
    });
})(); 