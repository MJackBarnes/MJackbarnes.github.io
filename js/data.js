function toDataFormat(data){
    this.xs = [];
    this.labels = []
    for(var i = 0; i < data.length; i ++){
        this.xs[this.xs.length] = data[i].input;
        this.labels[this.labels.length] = data[i].output;
    }
}