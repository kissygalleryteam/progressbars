KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('progressbars', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/progressbars/1.0.0/']});