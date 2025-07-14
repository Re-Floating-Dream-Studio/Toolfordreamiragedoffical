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
        // 处理URL中可能的变化
        if(parts.length >= 2) {
            return parts.slice(-2).join('/');
        } else if(parts.length === 1 && parts[0].includes('html')) {
            // 处理可能直接位于根目录的情况
            return 'tool/' + parts[0];
        }
        return parts.slice(-1)[0]; // 默认返回最后一部分
    }
    
    // 检查工具状态
    function checkToolStatus() {
        const currentPath = getCurrentPath();
        let toolId = toolPathToId[currentPath];
        
        // 尝试不同的路径组合找到匹配
        if (!toolId) {
            // 尝试从URL中提取文件名
            const filename = currentPath.split('/').pop();
            for (const path in toolPathToId) {
                if (path.endsWith(filename)) {
                    toolId = toolPathToId[path];
                    break;
                }
            }
        }
        
        if (!toolId) return;
        
        const savedStatus = localStorage.getItem('dreamirage_tools_status');
        if (!savedStatus) return;
        
        try {
            const statusData = JSON.parse(savedStatus);
            const toolStatus = statusData.find(item => item.id === toolId);
            
            if (toolStatus && (toolStatus.status === 'maintenance' || toolStatus.status === 'development')) {
                showMaintenanceMessage(toolStatus.status);
                
                // 防止页面其余部分加载和执行
                document.documentElement.innerHTML = '';
                // 停止页面加载
                window.stop();
                // 阻止页面交互
                document.addEventListener('DOMContentLoaded', function() {
                    document.body.style.pointerEvents = 'none';
                    setTimeout(function() {
                        // 重定向到首页的选项（如果用户强行刷新绕过初始检查）
                        const redirectContainer = document.createElement('div');
                        redirectContainer.style.position = 'fixed';
                        redirectContainer.style.bottom = '20px';
                        redirectContainer.style.left = '50%';
                        redirectContainer.style.transform = 'translateX(-50%)';
                        redirectContainer.style.textAlign = 'center';
                        redirectContainer.style.zIndex = '9999';
                        
                        const redirectTimer = document.createElement('div');
                        redirectTimer.textContent = '10秒后自动返回首页...';
                        redirectTimer.style.marginBottom = '10px';
                        redirectTimer.style.color = '#666';
                        redirectTimer.style.fontSize = '14px';
                        
                        redirectContainer.appendChild(redirectTimer);
                        document.body.appendChild(redirectContainer);
                        
                        // 倒计时并重定向
                        let seconds = 10;
                        const countdownInterval = setInterval(function() {
                            seconds--;
                            redirectTimer.textContent = `${seconds}秒后自动返回首页...`;
                            if (seconds <= 0) {
                                clearInterval(countdownInterval);
                                window.location.href = '../index.html';
                            }
                        }, 1000);
                    }, 100);
                });
                return true;
            }
        } catch (e) {
            console.error('Error checking tool status:', e);
        }
        
        return false;
    }
    
    // 显示维护或开发中消息
    function showMaintenanceMessage(status) {
        try {
            // 获取保存的消息
            let message = localStorage.getItem('dreamirage_maintenance_message') || 
                '很抱歉，该工具目前正在维护/开发中，暂时无法使用。请稍后再试或联系管理员获取更多信息。';
            
            // 替换状态文本
            message = message.replace('维护/开发中', status === 'maintenance' ? '维护中' : '开发中');
            
            // 清除页面上的所有内容
            document.open();
            document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' + 
                (status === 'maintenance' ? '工具维护中' : '工具开发中') + 
                ' - Dreamirage Tool</title></head><body></body></html>');
            document.close();
            
            // 重置页面内容
            document.body.innerHTML = '';
            document.body.style.margin = '0';
            document.body.style.padding = '0';
            document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            document.body.style.height = '100vh';
            document.body.style.display = 'flex';
            document.body.style.flexDirection = 'column'; // 使用列布局便于添加额外元素
            document.body.style.alignItems = 'center';
            document.body.style.justifyContent = 'center';
            document.body.style.fontFamily = "'Nunito', 'Arial', sans-serif";
            document.body.style.overflow = 'hidden'; // 防止滚动
            
            // 引入必要的CSS
            const fontLink = document.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
            
            const iconLink = document.createElement('link');
            iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            iconLink.rel = 'stylesheet';
            document.head.appendChild(iconLink);
            
            // 创建消息容器
            const messageBox = document.createElement('div');
            messageBox.style.maxWidth = '500px';
            messageBox.style.width = '90%';
            messageBox.style.backgroundColor = '#fff';
            messageBox.style.borderRadius = '10px';
            messageBox.style.padding = '40px 30px';
            messageBox.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
            messageBox.style.textAlign = 'center';
            messageBox.style.animation = 'fadeIn 0.5s ease-out';
            messageBox.style.position = 'relative';
            messageBox.style.zIndex = '100';
            
            // 创建动画样式
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
            
            // 设置标题和消息
            const icon = document.createElement('i');
            icon.className = status === 'maintenance' ? 'fas fa-wrench' : 'fas fa-code-branch';
            icon.style.fontSize = '64px';
            icon.style.color = status === 'maintenance' ? '#ff5252' : '#ffab00';
            icon.style.marginBottom = '25px';
            icon.style.display = 'block';
            icon.style.animation = 'pulse 2s infinite';
            
            const title = document.createElement('h2');
            title.textContent = status === 'maintenance' ? '工具维护中' : '工具开发中';
            title.style.fontSize = '28px';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '20px';
            title.style.color = '#333';
            
            const messageText = document.createElement('p');
            messageText.textContent = message;
            messageText.style.fontSize = '18px';
            messageText.style.color = '#666';
            messageText.style.lineHeight = '1.6';
            messageText.style.marginBottom = '30px';
            
            const backButton = document.createElement('a');
            backButton.href = '../index.html';
            backButton.textContent = '返回首页';
            backButton.style.display = 'inline-block';
            backButton.style.padding = '12px 25px';
            backButton.style.backgroundColor = '#4361ee';
            backButton.style.color = '#fff';
            backButton.style.borderRadius = '6px';
            backButton.style.textDecoration = 'none';
            backButton.style.fontWeight = 'bold';
            backButton.style.transition = 'all 0.3s ease';
            backButton.style.fontSize = '16px';
            backButton.style.border = 'none';
            backButton.style.cursor = 'pointer';
            backButton.style.boxShadow = '0 4px 15px rgba(67, 97, 238, 0.3)';
            
            backButton.onmouseover = function() {
                this.style.backgroundColor = '#3a51d6';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 6px 20px rgba(67, 97, 238, 0.4)';
            };
            
            backButton.onmouseout = function() {
                this.style.backgroundColor = '#4361ee';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 15px rgba(67, 97, 238, 0.3)';
            };
            
            // 组装消息框
            messageBox.appendChild(icon);
            messageBox.appendChild(title);
            messageBox.appendChild(messageText);
            messageBox.appendChild(backButton);
            document.body.appendChild(messageBox);
            
            // 添加自动跳转倒计时
            const countdownDiv = document.createElement('div');
            countdownDiv.style.position = 'absolute';
            countdownDiv.style.bottom = '-30px';
            countdownDiv.style.left = '0';
            countdownDiv.style.width = '100%';
            countdownDiv.style.textAlign = 'center';
            countdownDiv.style.fontSize = '14px';
            countdownDiv.style.color = '#666';
            messageBox.appendChild(countdownDiv);
            
            let seconds = 5;
            countdownDiv.textContent = `${seconds}秒后自动返回首页...`;
            const countdownInterval = setInterval(() => {
                seconds--;
                if (seconds <= 0) {
                    clearInterval(countdownInterval);
                    window.location.href = '../index.html';
                } else {
                    countdownDiv.textContent = `${seconds}秒后自动返回首页...`;
                }
            }, 1000);
            
            // 创建当前工具路径信息（用于调试）
            const pathInfo = document.createElement('div');
            pathInfo.style.position = 'fixed';
            pathInfo.style.bottom = '10px';
            pathInfo.style.left = '10px';
            pathInfo.style.fontSize = '10px';
            pathInfo.style.color = 'rgba(0,0,0,0.3)';
            pathInfo.textContent = `当前路径: ${getCurrentPath()}`;
            document.body.appendChild(pathInfo);
            
            // 更新页面标题
            document.title = status === 'maintenance' ? '工具维护中 - Dreamirage Tool' : '工具开发中 - Dreamirage Tool';
            
            // 停止页面上所有其他脚本的执行
            window.stop();
            
            // 阻止历史记录导航
            history.pushState(null, null, location.href);
            window.addEventListener('popstate', function() {
                history.pushState(null, null, location.href);
            });
        } catch (error) {
            // 如果发生错误，使用更简单的方法
            alert(`工具${status === 'maintenance' ? '维护中' : '开发中'}\n请稍后再试或联系管理员。`);
            window.location.href = '../index.html';
        }
    }
    
    // 立即检查状态 - 放在最前面执行，确保在页面开始加载时就检查
    if (checkToolStatus()) {
        // 如果工具不可用，则立即停止后续操作
        throw new Error('Tool unavailable');
    }
    
    // 页面加载时再次检查状态
    window.addEventListener('DOMContentLoaded', function() {
        checkToolStatus();
    });
    
    // 监听历史记录变化，防止用户通过浏览器后退访问
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // 页面从缓存中恢复时也要检查
            checkToolStatus();
        }
    });
    
    // 添加全局错误处理，确保任何情况下工具状态检查都能正常工作
    window.addEventListener('error', function(event) {
        console.error('Error in tool status check:', event.error);
    });
})(); 