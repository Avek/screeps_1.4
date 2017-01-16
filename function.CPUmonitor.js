/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('function.CPUmonitor');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep, elapsed, name)
    {
        if (typeof name === 'undefined') { name = creep.name; }
        var elapsed = Math.round(elapsed * 100)/100;
        this.add(name, elapsed);
    },

    init: function() {
        var arr = [];
        if (Game.CPUmonitor)
            Game.CPUmonitor = arr;
        else
            Game.CPUmonitor = [];
    },

    report: function ()
    {
        var report = "CPU Usage: ";
        var total = 0;
        if(Game.CPUmonitor){
            var len = Game.CPUmonitor.length;
            var sorted = _.sortBy( Game.CPUmonitor, 'cpu' );
            sorted = sorted.reverse();
            for (var i = 0; i < len; i++) {
                var record = sorted[i];
                if(i <= 100)
                    report = report + record.name + " " + record.cpu + " || ";
                total += record.cpu;
            }
        }
        total = Math.round(total * 100)/100;
        report += "total: " + total;
        console.log(report);
    },
    
    add: function (obj, cpu)
    {
        var record = {
            name:obj,
            cpu:cpu
        };

        if(Game.CPUmonitor){
            Game.CPUmonitor.push(record);
        }

    },

    heatmap: function(elapsed)
    {
        if(!Memory.cpuMap || !Memory.cpuQueue || Memory.cpuQueue.length < 1000)
            this.init_heatmap();

        var reportingCpu = Game.cpu.getUsed();
        var hundredAvg = 0;
        for(var i = 1000; i > 900 ; i--){
            hundredAvg+=Memory.cpuQueue[i];
        }
        hundredAvg=hundredAvg/100;
        var thousandAvg = 0;
        for(var i = 1000; i > 0 ; i--){
            thousandAvg+=Memory.cpuQueue[i];
        }
        thousandAvg=thousandAvg/1000;
        var cpuDelta = (Math.round((thousandAvg-hundredAvg)*100)/100);


        console.log(hundredAvg+" : "+thousandAvg);
        Memory.cpuQueue.shift();

        var colorHue = ((cpuDelta+3)/6);


        var r=Math.floor(510*(1-colorHue));
        if(r>255)
            r=255;
        var g=Math.floor(510*(colorHue));
        if(g>255)
            g=255;
        var b=0;
        if(colorHue<0)
            colorHue=0;
        else if(colorHue>9)
            colorHue=9;
        var header = "<b style=\"background-color:rgb("+r+","+g+","+b+");color:black\">"+Math.floor(colorHue*10)+"</b>";
        //console.log(header);

        var map = "";
        for (var i in Memory.cpuMap) {
            if(i == 30){
                map="<i style=\"background-color:magenta\">"+Memory.cpuMap[i]+"</i>"+map;
            }else
                map=Memory.cpuMap[i]+map;
        }
        map='CPU delta(hu/th): ' + cpuDelta+' '+map;
        console.log(map);
        //console.log(Game.time);
        if(Game.time%10==0){
            Memory.cpuMap.push(header);
            Memory.cpuMap.shift();
        }
        var elapsed = Game.cpu.getUsed() - reportingCpu;
        //console.log("Used: "+elapsed+" cpu reporting");
    },

    init_heatmap: function()
    {

        Memory.cpuMap = [];
        Memory.cpuQueue = [];
        if(Memory.cpuQueue.length < 1000){
            for(var i = 0; i <= 1000; i++){
                Memory.cpuQueue.push(9);
            }
        }

        if(Memory.cpuMap.length < 50){
            for(var i = 0; i <= 50; i++){
                Memory.cpuMap.push(5);
            }
        }

    }
};