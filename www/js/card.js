;( function( window ) {

    // support
    var is3d = true;

    function extend( a, b ) {
        for( var key in b ) { 
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function setTransformStyle( el, tval ) {
        el.style.WebkitTransform = tval;
        el.style.msTransform = tval;
        el.style.transform = tval;
    }


    function ElasticCard ( el, options ) {
        this.container = el;
        this.options = extend( {}, this.options );
        extend( this.options, options );
        this._init();
    }

    ElasticCard.prototype.options = {
        // distDragBack: if the user stops dragging the image in a area that does not exceed [distDragBack]px for either x or y then the image goes back to the stack 
        distDragBack : 100,
        // distDragMax: if the user drags the image in a area that exceeds [distDragMax]px for either x or y then the image moves away from the stack 
        distDragMax : 150,
        // isLocked: if we do not allow drag, the isLocked is true
        isLocked: false
    };

    ElasticCard.prototype._init = function () {

        this.cardElem = this.container.children[0];
        this._setCardStyle();

        this._initDragg();

        // init drag events
        this._initEvents();
    };

    ElasticCard.prototype._initDragg = function () {
        this.card =  new Hammer(this.cardElem);
    }
    ElasticCard.prototype._initEvents = function() {
        var self = this;
        this.card.on( 'panstart', function( i, e, p ) { self._onDragStart( i, e, p ); } );
        this.card.on( 'panleft panright', function( i, e, p ) { self._onDragMove( i, e, p ); } );
        this.card.on( 'panend', function( i, e, p ) { self._onDragEnd( i, e, p ); } );
    };

    ElasticCard.prototype._setCardStyle = function () {
        var item1 = this._firstItem(), item2 = this._secondItem(), item3 = this._thirdItem();

        if( item1 ) {
            item1.style.opacity = 1;
            item1.style.zIndex = 4;
            setTransformStyle( item1, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
        }

        if( item2 ) {
            item2.style.opacity = 1;
            item2.style.zIndex = 3;
            setTransformStyle( item2, is3d ? 'translate3d(0,0,-60px)' : 'translate(0,0)' );
        }

        if( item3 ) {
            item3.style.opacity = 1;
            item3.style.zIndex = 2;
            setTransformStyle( item3, is3d ? 'translate3d(0,0,-120px)' : 'translate(0,0)' );
        }
    };

    ElasticCard.prototype._onDragStart = function (event) {
        this.options.isLocked = !this._showMove(event);
    };

    ElasticCard.prototype._onDragMove = function (event) {
        // the second and third items also move
        var item1 = this._firstItem();
        var item2 = this._secondItem(), item3 = this._thirdItem();
        var deltaX = event.deltaX;
        var deltaY = event.deltaY;

        if (!this._showMove(event)) {

        } else {
            if (this._outOfBounds(event)) {
                this._moveAway(event);
            } else {
                if( item1) {
                    setTransformStyle( item1, is3d ? 'translate3d(' + ( deltaX ) + 'px, ' + (deltaY) + 'px, 0px)' : 'translate(' + ( deltaX ) + 'px,  ' + (deltaY) + 'px)' );
                    //item1.className += ' animate';
                }
                if( item2 ) {
                    //setTransformStyle( item2, is3d ? 'translate3d(' + ( deltaX * .6 ) + 'px, 0px, -60px)' : 'translate(' + ( deltaX * .6 ) + 'px, 0px)' ); 
                    setTransformStyle( item2, is3d ? 'translate3d(0px, 0px, -30px)' : 'translate(0px, 0px)' );
                    //item2.className += ' animate';
                }
                if( item3 ) {
                    //setTransformStyle( item3, is3d ? 'translate3d(' + ( deltaX * .3 ) + 'px, 0px, -120px)' : 'translate(' + ( deltaX * .3 ) + 'px, 0px)' );
                    setTransformStyle( item3, is3d ? 'translate3d(0px, 0px, -60px)' : 'translate(0px, 0px)' );
                    //item3.className += ' animate';
                }
            }
        }
    };

    ElasticCard.prototype._onDragEnd = function (event) {
        if (this._outOfBounds(event)){
            this._moveAway(event);
        }

        if (!this._showMove(event)) {
            this._moveBack(event);
        } else {
            if (this._outOfSight(event)) {
                this._moveAway(event);
            } else {
                this._moveBack(event);
            }
        }

        this.options.isLocked = false;
    };

    ElasticCard.prototype._showMove = function (event) {
        if (this.options.isLocked) {
            return false;
        }

        if ((-45 < event.angle && event.angle < 45) || event.angle > 135 || event.angle < -135) {
            return true;
        } else {
            return false;
        }
    };

    ElasticCard.prototype._outOfBounds = function (event) {
        if (event && event.deltaX) {
            return Math.abs(event.deltaX) > this.options.distDragMax;
        } else {
            return false;
        }
    };

    //returns true if x is bigger than distDragBack
    ElasticCard.prototype._outOfSight = function (event) {
        if (event && event.deltaX) {
            return Math.abs(event.deltaX) > this.options.distDragBack;
        } else {
            return false;
        }
    };

    ElasticCard.prototype._moveAway = function (event) {
        var self = this;
        // the second and third items also move
        var item1 = this._firstItem();
        var item2 = this._secondItem(), item3 = this._thirdItem();
        var deltaX = event.deltaX;
        var tVal = this._getTranslateVal(event);

        //if(this._outOfBounds())

        if( item1) {
            //setTransformStyle( item1, is3d ? 'translate3d(0px, 0px, 0px)' : 'translate(0px, 0px)' );

            setTransformStyle( item1, is3d ? 'translate3d(' + tVal.x + 'px,' + tVal.y + 'px, 0px)' : 'translate(' + tVal.x + 'px,' + tVal.y + 'px)' );
            
            item1.style.opacity = 0;
            
            setTimeout(function () {
                self.container.removeChild(item1);
            }, 400);
        }
        if( item2 ) {
            //setTransformStyle( item2, is3d ? 'translate3d(0px, 0px, -60px)' : 'translate(0px, 0px)' );
            //item2.className += ' animate';
        }
        if( item3 ) {
            //setTransformStyle( item3, is3d ? 'translate3d(0px, 0px, -120px)' : 'translate(0px, 0px)' );
            //item3.className += ' animate';
        }

        setTimeout(function () {
            self._init();
        }, 600);
    };

    ElasticCard.prototype._moveBack = function (event) {
        var self = this;
        // the second and third items also move
        var item1 = this._firstItem(), item2 = this._secondItem(), item3 = this._thirdItem();

        if( item1) {
            setTransformStyle( item1, is3d ? 'translate3d(0px, 0px, 0px)' : 'translate(0px, 0px)' );
        }
        if( item2 ) {
            setTransformStyle( item2, is3d ? 'translate3d(0px, 0px, -60px)' : 'translate(0px, 0px)' );
        }
        if( item3 ) {
            setTransformStyle( item3, is3d ? 'translate3d(0px, 0px, -120px)' : 'translate(0px, 0px)' );
        }
    };

    ElasticCard.prototype._getTranslateVal = function (event) {
        var deltaX = event.deltaX,
            deltaY = event.deltaY,
            h = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)),
            a = Math.asin(Math.abs(deltaY / h)) / (Math.PI / 180),
            hL = h + this.options.distDragBack,
            dx = Math.cos(a * (Math.PI / 180)) * hL,
            dy = Math.sin(a * (Math.PI / 180)) * hL,
            tx = dx - Math.abs(deltaX),
            ty = dy - Math.abs(deltaY);

        return {
            x: deltaX > 0 ? tx : tx * -1,
            y: deltaY > 0 ? ty : ty * -1
        }
    }

    ElasticCard.prototype._firstItem = function () {
        return this.container.children[0];
    };

    ElasticCard.prototype._secondItem = function () {
        return this.container.children[1];
    };

    ElasticCard.prototype._thirdItem = function () {
        return this.container.children[2];
    };

    window.ElasticCard = ElasticCard;
})( window );