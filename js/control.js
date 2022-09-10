/* 导航栏按钮的相关操作 */
/***************************************************************************/
//实现点击导航栏按钮进行切换
let nav_list = document.querySelectorAll(".nav_bar ul li");
let items = document.querySelectorAll(".right_block .body .item");
for (let i = 0; i < nav_list.length; i++) {
    nav_list[i].onclick = function () {
        //将导航栏所有li的类型名清空
        for (let j = 0; j < nav_list.length; j++) {
            nav_list[j].className = "";
        }
        this.className = "current"; //选择当前li标签

        //下侧主体部分对应进行选择
        for (let j = 0; j < items.length; j++) {
            items[j].style.display = "none";
        }
        items[i].style.display = "block";

        //清空message_box中的内容
        let message_box = document.querySelector("#message_box");
        removeAllChildren(message_box);
    }
}
/***************************************************************************/

/* 下侧四个按钮的相关操作 */
/***************************************************************************/
//点击放大地图按钮将地图放大
let zoom_in_btn = document.querySelector("#zoom_in_btn");
zoom_in_btn.onclick = function () {
    zoom.scaleBy(svg, 1.1); //触发zoom事件，放大地图
    d3.zoomTransform(svg.node());
}

//点击缩小地图按钮将地图缩小
let zoom_out_btn = document.querySelector("#zoom_out_btn");
zoom_out_btn.onclick = function () {
    zoom.scaleBy(svg, 0.9); //触发zoom事件，缩小地图
    d3.zoomTransform(svg.node());
}

//点击清空地图将地图清空
let clear_map_btn = document.querySelector("#clear_map_btn");
clear_map_btn.onclick = function () {
    shMetro.clear();
    drawMap();
}

//点击加载完整地图按钮重新绘制完整的地图
let load_map_btn = document.querySelector("#load_map_btn");
load_map_btn.onclick = function () {
    shMetro.clear(); //将地图清空
    shMetro.loadData(); //重新读取完整数据
    drawMap();
}
/***************************************************************************/

/* 站点部分相关操作 */
/***************************************************************************/
//删除站点的操作
let delete_node_btn = document.querySelector("#delete_node_btn");
delete_node_btn.onclick = function () {
    let delete_node_name = document.querySelector("#delete_node_name").value; //获取要删除的站点的名称

    //清空message_box中的内容
    let message_box = document.querySelector("#message_box");
    removeAllChildren(message_box);

    //判断输入框的内容是否为空
    if (delete_node_name == "") {
        let str = `<div><button>&times</button><span>站点的名称不能为空！</span></div>`;
        message_box.innerHTML = str;
    }
    else {
        //判断是否成功删除节点
        if (shMetro.deleteNode(delete_node_name)) {
            drawMap(); //删除节点后对线路图进行更新
            //编写提示内容并将其添加到message_box中
            let str = `<div><button>&times</button><span>删除成功!<br>删除了名为 <strong>${delete_node_name}</strong> 的站点。</span></div>`;
            message_box.innerHTML = str;
        }
        else {
            let str = `<div><button>&times</button><span>删除失败!<br>不存在名为 <strong>${delete_node_name}</strong> 的站点。</span></div>`;
            message_box.innerHTML = str;
        }
    }

    //点击右上方关闭按钮则关闭message_box
    let close_btn = document.querySelector("#message_box button");
    close_btn.onclick = function () {
        removeAllChildren(message_box);
    }
}

//添加站点的操作
let add_node_btn = document.querySelector("#add_node_btn");
add_node_btn.onclick = function () {
    let add_node_name = document.querySelector("#add_node_name").value; //要添加的站点的名字
    let lon = document.querySelector("#add_node_lon").value; //要添加的站点的经度
    let lat = document.querySelector("#add_node_lat").value; //要添加的站点的纬度
    //将输入的经纬度信息转换成浮点型
    let station_lon = parseFloat(lon);
    let station_lat = parseFloat(lat);

    //清空message_box中的内容
    let message_box = document.querySelector("#message_box");
    removeAllChildren(message_box);

    //判断输入框是否为空
    if (add_node_name == "" || lon == "" || lat == "") {
        let str = `<div><button>&times</button><span>请输入完整的站点信息！</span></div>`;
        message_box.innerHTML = str;
    }
    else {
        //判断输入的经纬度是否在上海的范围内
        if (station_lon >= lon_range[0] && station_lon <= lon_range[1] && station_lat >= lat_range[0] && station_lat <= lat_range[1]) {
            //将经纬度转换为线路图上的位置
            let [x, y] = MillerConvertion(lon, lat);
            //如果线路图上已经存在同名的站点，则会导致添加失败
            if (shMetro.addNode(add_node_name, x, y, [])) {
                drawMap();
                let str = `<div><button>&times</button><span>添加成功!<br>添加了了名为 <strong>${add_node_name}</strong> 的站点。</span></div>`;
                message_box.innerHTML = str;
            }
            else {
                let str = `<div><button>&times</button><span>添加失败!<br>已存在名为 <strong>${add_node_name}</strong> 的站点。</span></div>`;
                message_box.innerHTML = str;
            }

        }
        else {
            let str = `<div><button>&times</button><span>添加失败!<br>输入的经纬度不在上海市的范围内!</span></div>`;
            message_box.innerHTML = str;
        }
    }

    //点击右上方关闭按钮则关闭message_box
    let close_btn = document.querySelector("#message_box button");
    close_btn.onclick = function () {
        removeAllChildren(message_box);
    }
}
/***************************************************************************/

/* 线路部分相关操作 */
/***************************************************************************/
//对选择线路的选框进行更新
function updateLineSelect(lines) {
    let line_select = document.querySelector("#line_select");
    let select_line_to_view = document.querySelector("#select_line_to_view");

    //将选框内的内容清空
    removeAllChildren(line_select);
    removeAllChildren(select_line_to_view);

    for (let line_id of lines) {
        // let str = "<option>" + line_id + "<option>";
        line_select.add(new Option(`${line_id}`, `${line_id}`));
        select_line_to_view.add(new Option(`${line_id}`, `${line_id}`));
    }
}
updateLineSelect(shMetro.lineMap.keys()); //一开始先对选择框进行填充

//添加线路的操作
let add_line_btn = document.querySelector("#add_line_btn");
add_line_btn.onclick = function () {
    let add_line_id = document.querySelector("#add_line_id").value;
    let add_line_color = document.querySelector("#add_line_color").value.slice(1); //将得到的颜色值去掉第一个#

    //清空message_box中的内容
    let message_box = document.querySelector("#message_box");
    removeAllChildren(message_box);

    //判断线路id的输入是否为空
    if (add_line_id == "") {
        let str = `<div><button>&times</button><span>线路的ID不能为空！</span></div>`;
        message_box.innerHTML = str;
    }
    else {
        //判断是否已经存在同名的线路
        if (shMetro.lineMap.has(add_line_id)) {
            let str = `<div><button>&times</button><span>添加失败!<br>已存在ID为 <strong>${add_line_id}</strong> 的线路。</span></div>`;
            message_box.innerHTML = str;
        }
        else {
            shMetro.addLine(add_line_id, add_line_id, add_line_color);
            let str = `<div><button>&times</button><span>添加成功!<br>添加了了ID为 <strong>${add_line_id}</strong> 的线路。</span></div>`;
            message_box.innerHTML = str;
            updateLineSelect(shMetro.lineMap.keys());
        }
    }

    //点击右上方关闭按钮则关闭message_box
    let close_btn = document.querySelector("#message_box button");
    close_btn.onclick = function () {
        removeAllChildren(message_box);
    }
}

//向线路添加边的操作
let add_edge_to_line = document.querySelector("#add_edge_to_line");
add_edge_to_line.onclick = function () {
    //获取要添加的边的两个顶点
    let station1 = document.querySelector("#edge_vertex_1").value;
    let station2 = document.querySelector("#edge_vertex_2").value;

    //清空message_box中的内容
    let message_box = document.querySelector("#message_box");
    removeAllChildren(message_box);

    //判断线路id的输入是否为空
    if (station1 == "" || station2 == "") {
        let str = `<div><button>&times</button><span>站点名称不能为空！</span></div>`;
        message_box.innerHTML = str;
    }
    else {
        //判断当前线路图上是否已经存在输入的两个顶点
        if (!shMetro.vertexMap.has(station1) || !shMetro.vertexMap.has(station2)) {
            let str = `<div><button>&times</button><span>请检查输入的站点是否已经存在！</span></div>`;
            message_box.innerHTML = str;
        }
        else if (station1 == station2) {
            let str = `<div><button>&times</button><span>请输入不同的站点名称！</span></div>`;
            message_box.innerHTML = str;
        }
        else {
            let line_id = document.querySelector("#line_select").value;

            shMetro.addEdgeToLine(station1, station2, line_id);

            drawMap(); //更新线路图

            let str = `<div><button>&times</button><span>添加成功!<br>请在左侧线路图中查看新添加的边!</span></div>`;
            message_box.innerHTML = str;
        }
    }

    //点击右上方关闭按钮则关闭message_box
    let close_btn = document.querySelector("#message_box button");
    close_btn.onclick = function () {
        removeAllChildren(message_box);
    }
}
/***************************************************************************/

/* 换乘部分相关操作 */
/***************************************************************************/
//查看某条线路的操作
let view_line = document.querySelector("#view_line");
view_line.onclick = function () {
    let line_id = document.querySelector("#select_line_to_view").value;

    shMetro.loadData(); //选择前线重新加载地图
    let color = shMetro.selectLine(line_id);

    drawFullLine(shMetro.lineArray, color); //根据lineArray中的内容画当前线路的线路图

    //清空message_box中的内容
    let message_box = document.querySelector("#message_box");
    removeAllChildren(message_box);

    let str = `<div><button>&times</button><span>已在左侧显示选择的线路!</span></div>`;
    message_box.innerHTML = str;

    //点击右上方关闭按钮则关闭message_box
    let close_btn = document.querySelector("#message_box button");
    close_btn.onclick = function () {
        removeAllChildren(message_box);
    }
}

//搜索换乘方法的操作
let search_path_btn = document.querySelector("#search_path_btn");
search_path_btn.onclick = function () {
    let station1 = document.querySelector("#search_station_1").value;
    let station2 = document.querySelector("#search_station_2").value;

    //清空message_box中的内容
    let message_box = document.querySelector("#message_box");
    removeAllChildren(message_box);

    if (station1 == "" || station2 == "") {
        let str = `<div><button>&times</button><span>站点名称不能为空！</span></div>`;
        message_box.innerHTML = str;
    }
    else {
        if (!shMetro.vertexMap.has(station1) || !shMetro.vertexMap.has(station2)) {
            let str = `<div><button>&times</button><span>请检查输入的站点是否已经存在！</span></div>`;
            message_box.innerHTML = str;
        }
        else {
            if (shMetro.searchShortestPath(station1, station2)) {
                let str = `<div><button>&times</button><span>搜索成功!<br>请点击查看路线和换乘指南!</span></div>`;
                message_box.innerHTML = str;
            }
            else {
                let str = `<div><button>&times</button><span>搜索失败!<br>两个站点之间无法实现换乘!</span></div>`;
                message_box.innerHTML = str;
            }
        }
    }

    //点击右上方关闭按钮则关闭message_box
    let close_btn = document.querySelector("#message_box button");
    close_btn.onclick = function () {
        removeAllChildren(message_box);
    }

}

//显示换乘指南的操作
let view_transfer_guide_btn = document.querySelector("#view_transfer_guide_btn");
view_transfer_guide_btn.onclick = function () {
    //判断是否已经对线路进行了搜索
    if (shMetro.transferArray.length == 0) {
        let str = `<div>请先对换乘的线路进行搜索!</div>`;

        let body_content = document.querySelector("#body_content");
        removeAllChildren(body_content);
        body_content.innerHTML = str;
    }
    else {
        let str = shMetro.getTransferInfo();

        //将换乘信息添加到模态框的主体内容中
        let body_content = document.querySelector("#body_content");
        removeAllChildren(body_content);
        body_content.innerHTML = str;
    }

    //显示模态框
    let modal = document.querySelector("#modal");
    modal.style.display = "block";
}

//显示最短路径的操作
let show_shortest_path_btn = document.querySelector("#show_shortest_path_btn");
show_shortest_path_btn.onclick = function () {
    //清空message_box中的内容
    let message_box = document.querySelector("#message_box");
    removeAllChildren(message_box);

    //判断是否已经对线路进行了搜索
    if (shMetro.transferArray.length == 0) {
        let str = `<div><button>&times</button><span>请先对换乘的线路进行搜索!</span></div>`;
        message_box.innerHTML = str;
    }
    else {
        drawPartMap(shMetro.transferArray); //根据transferArray中的内容绘制部分地图

        let str = `<div><button>&times</button><span>已在左侧显示换乘的线路!</span></div>`;
        message_box.innerHTML = str;
    }

    //点击右上方关闭按钮则关闭message_box
    let close_btn = document.querySelector("#message_box button");
    close_btn.onclick = function () {
        removeAllChildren(message_box);
    }
}

//显示完整地图的操作
let show_full_map_btn = document.querySelector("#show_full_map_btn");
show_full_map_btn.onclick = function () {
    drawMap();
}
/***************************************************************************/

/* 模态框相关操作 */
/***************************************************************************/
let header_close_btn = document.querySelector("#header_close_btn");
header_close_btn.onclick = function () {
    let modal = document.querySelector("#modal");
    modal.style.display = "none";
}

let footer_close_btn = document.querySelector("#footer_close_btn");
footer_close_btn.onclick = function () {
    let modal = document.querySelector("#modal");
    modal.style.display = "none";
}
/***************************************************************************/