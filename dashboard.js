/**
 * MindFlow Canvas Analytics Dashboard
 * Implements high-performance, lightweight charting routines without heavy charting libraries.
 */

function initDashboardCharts() {
    const flowCanvas = document.getElementById('canvas-flow-chart');
    const heatmapCanvas = document.getElementById('canvas-stress-heatmap');
    
    if (flowCanvas) {
        drawFlowTimelineChart(flowCanvas);
    }
    
    if (heatmapCanvas) {
        drawStressHeatmap(heatmapCanvas);
    }
}

function drawFlowTimelineChart(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Set correct drawing resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 200 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = rect.width;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    
    ctx.clearRect(0, 0, width, height);
    
    // Mock Data points (7 Days)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const alertness = [85, 70, 90, 60, 80, 95, 75]; // Teal line
    const frustration = [10, 45, 15, 70, 30, 10, 55]; // Orange line
    
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (graphHeight * i / 4);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }
    
    // Draw days labels on X axis
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    const xStep = graphWidth / (days.length - 1);
    days.forEach((day, index) => {
        const x = padding.left + (index * xStep);
        ctx.fillText(day, x, height - 10);
    });
    
    // Y axis labels (Percentage)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
        const val = 100 - (25 * i);
        const y = padding.top + (graphHeight * i / 4);
        ctx.fillText(`${val}%`, padding.left - 8, y);
    }
    
    // Draw Alertness Line (Teal)
    drawLine(ctx, alertness, xStep, padding, graphHeight, '#00f2fe', 'rgba(0, 242, 254, 0.05)');
    
    // Draw Frustration Line (Orange)
    drawLine(ctx, frustration, xStep, padding, graphHeight, '#ff9900', 'rgba(255, 153, 0, 0.05)');
    
    // Draw Legends
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    
    // Alertness Legend
    ctx.fillStyle = '#00f2fe';
    ctx.fillRect(padding.left, 5, 8, 8);
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Cognitive Alertness', padding.left + 14, 10);
    
    // Frustration Legend
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(padding.left + 130, 5, 8, 8);
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Stress / Frustration', padding.left + 144, 10);
}

function drawLine(ctx, data, xStep, padding, graphHeight, strokeColor, fillColor) {
    ctx.beginPath();
    
    // Calculate coordinates
    const points = data.map((val, index) => {
        const x = padding.left + (index * xStep);
        const y = padding.top + (graphHeight * (1 - val / 100));
        return { x, y };
    });
    
    // Draw smooth bezier curve
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i+1].x) / 2;
        const yc = (points[i].y + points[i+1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    
    // Gradient fill under the line
    ctx.lineTo(points[points.length - 1].x, padding.top + graphHeight);
    ctx.lineTo(points[0].x, padding.top + graphHeight);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    // Draw points circles
    points.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = strokeColor;
        ctx.fill();
        ctx.strokeStyle = '#090a0f';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

function drawStressHeatmap(canvas) {
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 200 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = rect.width;
    const height = 200;
    const padding = { top: 20, right: 10, bottom: 25, left: 40 };
    
    ctx.clearRect(0, 0, width, height);
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM'];
    
    const gridWidth = width - padding.left - padding.right;
    const gridHeight = height - padding.top - padding.bottom;
    
    const cellWidth = gridWidth / hours.length;
    const cellHeight = gridHeight / days.length;
    
    // Mock Heatmap Intensity values (0 to 1)
    const heatmapValues = [
        [0.1, 0.2, 0.1, 0.4, 0.2, 0.1, 0.5, 0.8, 0.9], // Mon
        [0.2, 0.1, 0.3, 0.2, 0.1, 0.4, 0.3, 0.6, 0.8], // Tue
        [0.1, 0.1, 0.2, 0.1, 0.3, 0.2, 0.4, 0.9, 0.7], // Wed
        [0.4, 0.3, 0.1, 0.6, 0.8, 0.5, 0.7, 0.8, 0.9], // Thu (Stressful day!)
        [0.2, 0.2, 0.2, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], // Fri
        [0.1, 0.1, 0.1, 0.2, 0.1, 0.2, 0.3, 0.4, 0.3], // Sat
        [0.3, 0.4, 0.5, 0.6, 0.2, 0.1, 0.6, 0.7, 0.8]  // Sun
    ];
    
    // Draw cells
    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
        for (let hourIdx = 0; hourIdx < hours.length; hourIdx++) {
            const intensity = heatmapValues[dayIdx][hourIdx];
            const x = padding.left + (hourIdx * cellWidth);
            const y = padding.top + (dayIdx * cellHeight);
            
            // Choose cell color based on intensity (HSL interpolation: Green-Amber-Red)
            // Low intensity = Transparent/Dark Teal, High intensity = Glowing Amber/Red
            let color = 'rgba(0, 242, 254, 0.05)';
            if (intensity > 0.7) {
                color = `rgba(255, 59, 48, ${intensity - 0.2})`; // Red panic
            } else if (intensity > 0.4) {
                color = `rgba(255, 153, 0, ${intensity - 0.1})`; // Amber stress
            } else if (intensity > 0.2) {
                color = `rgba(79, 172, 254, ${intensity})`; // Blue focus
            }
            
            ctx.fillStyle = color;
            // Draw slightly rounded cells
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4, 3);
            ctx.fill();
        }
    }
    
    // Draw axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '9px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    
    // Days on Y axis
    days.forEach((day, index) => {
        const y = padding.top + (index * cellHeight) + (cellHeight / 2);
        ctx.fillText(day, padding.left - 8, y);
    });
    
    // Hours on X axis
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    hours.forEach((hour, index) => {
        const x = padding.left + (index * cellWidth) + (cellWidth / 2);
        ctx.fillText(hour, x, height - 20);
    });
}
