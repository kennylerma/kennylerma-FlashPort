import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import { CanvasKit } from "canvaskit-wasm";
import { AssetLoader, Sprite } from '@flashport/flashport';
import { Shape } from '@flashport/flashport';
import { StageScaleMode } from '@flashport/flashport';
import { StageAlign } from '@flashport/flashport';
import { Bitmap } from '@flashport/flashport';
import { AEvent, MouseEvent, TouchEvent } from '@flashport/flashport';
import { Scrollbar } from './com/kennylerma/display/Scrollbar';
import { MobileCheck } from './com/kennylerma/utils/MobileCheck';
import { Samples } from './Samples';
import { Hire } from './Hire';
import { DropShadowFilter } from '@flashport/flashport';
import { Matrix } from '@flashport/flashport';
import { TextField, TextFormat } from '@flashport/flashport';
import { Tweener } from '@flashport/flashport';
import { Equations } from '@flashport/flashport';
import { DisplayShortcuts } from '@flashport/flashport';
import { FPConfig } from '@flashport/flashport';
import { Resume } from "./Resume";
	
export class Main extends Sprite
{
	private _header:Sprite;
	private _logo:Bitmap;
	
	private _buttonContainer:Sprite;
	private _samplesTxt:TextField;
	private _resumeTxt:TextField;
	private _hireTxt:TextField;
	private _blogTxt:TextField;
	
	private _resume:Resume;
	private _hire:Hire;
	//private var _blog:Blog;		
	private _samplesContainer:Samples;
	private _samplesMask:Shape;
	private _scrollbar:Scrollbar;
	
	private _mat:Matrix;
	private _touchDown:number;
	private _touchDownTime:number;
	private _touchUpTime:number;
	private _isTouchMove:boolean = false;
	private _swipeVelocity:number = 0;
	private _scrollPercent:number = 0;
	
	private _isMobile:boolean = false;
	
	constructor()
	{
		FPConfig.autoSize = true;

		super();
		
		this.stage.scaleMode = StageScaleMode.NO_SCALE;
		this.stage.align = StageAlign.TOP_LEFT;
		this.stage.canvas.style.background = '#464646 url("/assets/blkcloth.webp") repeat';
		this.stage.frameRate = 30;
		
		this._isMobile = MobileCheck.isMobile();
		
		DisplayShortcuts.init();

		const assetLoader:AssetLoader = new AssetLoader(
			[
				"assets/kennylerma.png",
				"assets/Kenny.webp",
				"assets/fonts/Arial.ttf"
			]
		);
		assetLoader.addEventListener(AEvent.COMPLETE, this.init);
		assetLoader.load();
	}
	
	private init = (e:AEvent = null):void =>
	{
		this._samplesContainer = new Samples(this.stage);
		this._samplesContainer.addEventListener("SAMPLES_READY", this.SamplesReady);
		
		this._samplesMask = new Shape();
		this._samplesMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight - 80);
		this._samplesMask.x = 0;
		this._samplesMask.y = 80;
		this._samplesContainer.mask = this._samplesMask;
		this.addChild(this._samplesContainer);
		
		this._samplesContainer.init();
		
		
		var _this = this;
		var degrees:number = 90;
		var radians:number = Math.PI / 180 * degrees;
		this._mat = new Matrix();
		this._mat.createGradientBox(this.stage.stageWidth, 80, radians, 0, 0);
		
		this._header = new Sprite();
		this._header.graphics.beginGradientFill('linear', [0x8EC1F9, 0x2E8BF3], [1, .4], [0, 255], this._mat);
		this._header.graphics.drawRect(0, 0, this.stage.stageWidth, 80);
		//this._header.y = -this._header.height;
		this.addChild(this._header);
		
		var my_name:Bitmap = new Bitmap(FPConfig.images['kennylerma']);
		my_name.filters = [new DropShadowFilter(5, 45, 0x000000)];
		my_name.y = 30;
		my_name.x = 120;
		_this._header.addChild(my_name);
		
		//logo
		_this._logo = new Bitmap(FPConfig.images['Kenny']);
		_this._logo.scaleY = _this._logo.scaleX = .32;
		_this._logo.x = 12;
		_this._logo.y = -100;
		_this._logo.alpha = 0;
		
		var m:Shape = new Shape();
		m.graphics.drawCircle(0, 0, 50);
		m.x = 60;
		m.y = 60;
		_this._logo.mask = m;
		
		_this.addChild(_this._logo);
		
		var logoBorder:Shape = new Shape();
		logoBorder.graphics.lineStyle(4, 0xFFFFFF);
		logoBorder.graphics.drawCircle(0, 0, 50);
		//logoBorder.filters = [new DropShadowFilter(5, 45, 0x000000)];
		logoBorder.x = 60;
		logoBorder.y = 60;
		_this.addChild(logoBorder);
		
		Tweener.addTween(_this._logo, {time: 1, delay: .2, y: 10, alpha: 1});
		
		var tf:TextFormat = new TextFormat("Arial", this._isMobile ? 32 : 16, 0x464646, true);
		
		this._samplesTxt = new TextField();
		this._samplesTxt.defaultTextFormat = tf;
		this._samplesTxt.text = "SAMPLES";
		this._samplesTxt.x = this._samplesTxt.y -= 2;
		
		this._resumeTxt = new TextField();
		this._resumeTxt.defaultTextFormat = tf;
		this._resumeTxt.text = "RESUME";
		this._resumeTxt.x = this._resumeTxt.y -= 2;
		
		this._hireTxt = new TextField();
		this._hireTxt.defaultTextFormat = tf;
		this._hireTxt.text = "HIRE";
		this._hireTxt.x = this._hireTxt.y -= 2;
		
		/*_blogTxt = new TextField();
			_blogTxt.defaultTextFormat = tf;
			_blogTxt.text = "BLOG";
			_blogTxt.x = _blogTxt.y -= 2;*/
		
		var samplesHitArea:Sprite = new Sprite();
		samplesHitArea.graphics.beginFill(0xFFFFFF, 0);
		samplesHitArea.graphics.drawRect(0, 0, this._samplesTxt.textWidth, this._samplesTxt.textHeight);
		samplesHitArea.buttonMode = true;
		samplesHitArea.addChild(this._samplesTxt);
		
		var resumeHitArea:Sprite = new Sprite();
		resumeHitArea.graphics.beginFill(0xFFFFFF, 0);
		resumeHitArea.graphics.drawRect(0, 0, this._resumeTxt.textWidth, this._resumeTxt.textHeight);
		resumeHitArea.buttonMode = true;
		resumeHitArea.x = this._samplesTxt.textWidth + 50;
		resumeHitArea.addChild(this._resumeTxt);
		
		var hireHitArea:Sprite = new Sprite();
		hireHitArea.graphics.beginFill(0xFFFFFF, 0);
		hireHitArea.graphics.drawRect(0, 0, this._hireTxt.textWidth, this._hireTxt.textHeight);
		hireHitArea.buttonMode = true;
		hireHitArea.x = resumeHitArea.x + this._resumeTxt.textWidth + 50;
		hireHitArea.addChild(this._hireTxt);
		
		/*var blogHitArea:Sprite = new Sprite();
		blogHitArea.graphics.beginFill(0xFFFFFF, 0);
		blogHitArea.graphics.drawRect(0, 0, _blogTxt.textWidth, _blogTxt.textHeight);
		blogHitArea.buttonMode = true;
		blogHitArea.x = hireHitArea.x + _hireTxt.textWidth + 50;
		blogHitArea.addChild(_blogTxt);
		_blogTxt.addEventListener(MouseEvent.CLICK, OnBlogClicked);*/

		resumeHitArea.addEventListener(MouseEvent.CLICK, this.OnResumeClicked);
		hireHitArea.addEventListener(MouseEvent.CLICK, this.OnHireClicked);
		
		this._buttonContainer = new Sprite();
		this._buttonContainer.addChild(samplesHitArea);
		this._buttonContainer.addChild(resumeHitArea);
		this._buttonContainer.addChild(hireHitArea);
		//_buttonContainer.addChild(blogHitArea);
		this._buttonContainer.y = (this._isMobile) ? 25 : 40;
		this._buttonContainer.x = (this._isMobile) ? this.stage.stageWidth - this._buttonContainer.width - 30 : (this.stage.stageWidth - this._buttonContainer.getBounds(this._buttonContainer).width) / 2;
		this._header.addChild(this._buttonContainer);
		
		/*
		
			_blog = new Blog("270", window.innerHeight.toString());
			_blog.x = window.innerWidth - 280;
			_blog.y = 90;
		
			*/
		
			this._scrollbar = new Scrollbar(this.stage.stageHeight - 84);
			this._scrollbar.addEventListener("change", this.OnScrollbarChange);
			this._scrollbar.y = 82;
			this._scrollbar.x = this.stage.stageWidth - this._scrollbar.width - 2;
		
		if (!this._isMobile)
		{
			this.addChild(this._scrollbar);
		}
		
		Tweener.addTween(this._header, {time: 1.2, y: 0, transition: Equations.easeOutBounce});
		
		// handle window Resize
		window.addEventListener("resize", this.OnResize, false);
		
		//console.log("Main.init()");
	};
	
	private OnBlogClicked = ():void =>
	{
		/*_stage.removeChild(_samplesContainer);
			_stage.addChild(_blog);
			_blog.showMainDisplay();*/
		
		//window.history.pushState("", "Blog", "blog");
		//document.title = "Blog";
	};
	
	private OnResumeClicked = ():void =>
	{
		if (MobileCheck.isMobile())
		{
			window.open("https://docs.google.com/document/d/e/2PACX-1vQ_2a3hxFb155mm6EE5rsz9PdalrXN-TMET1HDsnA8ViZeHq_Umc5HefjXhOWx83OmGvPqEnMNb8TSO/pub", "_blank");
		}
		else
		{
			this._resume = new Resume();
			this.addChild(this._resume);
			this._resume.addEventListener(MouseEvent.CLICK, this.RemoveResume);
		}
		
	};

	private RemoveResume = ():void =>
	{
		this._resume.removeEventListener(MouseEvent.CLICK, this.RemoveResume);
		this.removeChild(this._resume);
		var element:HTMLElement = document.getElementById("resume") as HTMLElement;
		element.parentNode.removeChild(element);
	}
	
	private OnHireClicked = (e:MouseEvent):void =>
	{
		this._hire = new Hire();
		this.addChild(this._hire);
		
		this._hire.addEventListener(MouseEvent.CLICK, this.RemoveHire);
	};
	
	private RemoveHire = ():void =>
	{
		this._hire.removeEventListener(MouseEvent.CLICK, this.RemoveHire);
		this.removeChild(this._hire);
	};
	
	private SamplesReady = (e:Event):void =>
	{
		//trace("Samples Ready");
		if (this._isTouchMove)
		{
			this._isTouchMove = false;
			return;
		}
		
		if (this._isMobile || this.stage.stageHeight - 80 > this._samplesContainer.height)
		{
			this._scrollbar.visible = false;
			this.RemoveMouseWheel();
		}
		else
		{
			this._scrollbar.visible = true;
			this.AddMouseWheel();
		}
		
		this._samplesContainer.addEventListener(TouchEvent.TOUCH_BEGIN, this.handleTouchBegin);
	};
	
	private OnResize = ():void =>
	{
		//trace("Main.Resize");
		this._header.graphics.clear();
		this._header.graphics.beginGradientFill('linear', [0x8EC1F9, 0x2E8BF3], [1, .4], [0, 255], this._mat);
		this._header.graphics.drawRect(0, 0, this.stage.stageWidth, 80);
		
		this._samplesMask.graphics.clear();
		this._samplesMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight - 80);
		
		this._buttonContainer.x = (this._isMobile) ? this.stage.stageWidth - this._buttonContainer.getBounds(this._buttonContainer).width - 30 : (this.stage.stageWidth - this._buttonContainer.getBounds(this._buttonContainer).width) / 2;
		
		this._samplesContainer.resizeLayout();
		
		this._scrollbar.x = this.stage.stageWidth - this._scrollbar.width - 2;
		this._scrollbar.resize(this.stage.stageHeight - 84);
	};
	
	private AddMouseWheel = ():void =>
	{
		this.stage.addEventListener(MouseEvent.MOUSE_WHEEL, this.doScroll, false);
	};
	
	private RemoveMouseWheel = ():void =>
	{
		this.stage.removeEventListener(MouseEvent.MOUSE_WHEEL, this.doScroll);
	};
	
	private doScroll = (e:MouseEvent):void =>
	{
		var delta:number = e.delta;
		
		if (delta < 0)
		{
			if (this._scrollbar.value + Math.abs((delta / 3) * .2) < 1)
			{
				this._scrollbar.value += Math.abs((delta / 3) * .2);
			}
			else
			{
				this._scrollbar.value = 1;
			}
		}
		else if (delta > 0)
		{
			if (this._scrollbar.value - Math.abs((delta / 3) * .2) > 0)
			{
				this._scrollbar.value -= Math.abs((delta / 3) * .2);
			}
			else
			{
				this._scrollbar.value = 0;
			}
		}
	
		//e.preventDefault();
	};
	
	private OnScrollbarChange = (e:AEvent):void =>
	{
		//console.log("Scroll Value: " + _scrollbar.value);
		var topOffset:number = 20;
		var scrollArea:number = this._samplesContainer.height - this.stage.stageHeight;
		var scrollAmount:number = -((scrollArea + topOffset) * this._scrollbar.value) + topOffset;
		if (this._isMobile)
		{
			this._samplesContainer.y = scrollAmount;
		}
		else
		{
			Tweener.removeTweens(this._samplesContainer, "y");
			Tweener.addTween(this._samplesContainer, {time: .35, y: scrollAmount, transition: Equations.easeOutQuad});
		}
	};
	
	private handleTouchBegin = (e:TouchEvent):void =>
	{
		//console.log("handleTouchBegin");
		this._touchDown = this.mouseY;
		this._touchDownTime = new Date().getTime();
		this._samplesContainer.addEventListener(TouchEvent.TOUCH_MOVE, this.handleTouchMove);
		this._samplesContainer.addEventListener(TouchEvent.TOUCH_END, this.handleTouchEnd);
	};
	
	private handleTouchEnd = (e:TouchEvent):void =>
	{
		this._samplesContainer.removeEventListener(TouchEvent.TOUCH_MOVE, this.handleTouchMove);
		this._samplesContainer.removeEventListener(TouchEvent.TOUCH_END, this.handleTouchEnd);
		this._samplesContainer.enableSamples();
		this._isTouchMove = false;

		let gestureTime:number = new Date().getTime() - this._touchDownTime;
		this._swipeVelocity = gestureTime / 100;
		
		let swipeDelta:number = Math.abs(this.mouseY - this._touchDown) / 100;

		if (this._swipeVelocity < 1000)
		{
			//console.log('do it! ' + swipeDelta);
			let tweenPercent:number = this._scrollPercent > this._scrollbar.value ? this._scrollPercent + swipeDelta : this._scrollPercent - swipeDelta;
			if (tweenPercent > 1) tweenPercent = 1;
			if (tweenPercent < 0) tweenPercent = 0;
			this._scrollbar.value = this._scrollPercent;


			//Tweener.removeTweens(this._scrollbar, "value");
			Tweener.addTween(this._scrollbar, {time:.6, value: tweenPercent});
		}
	}
	
	private handleTouchMove = (e:TouchEvent):void =>
	{
		Tweener.removeTweens(this._scrollbar, "value");
		
		if (!this._isTouchMove)
		{
			this._isTouchMove = true;
			this._samplesContainer.disableSamples();
		}
		
		var delta:number = Math.abs(this.mouseY - this._touchDown);
		
		if (this.mouseY < this._touchDown)
		{
			this._samplesContainer.y -= delta;
			if (this._samplesContainer.y < -(this._samplesContainer.height - this._samplesMask.height - 80))
			{
				this._samplesContainer.y = -(this._samplesContainer.height - this._samplesMask.height - 80);
			}
			this._touchDown = this.mouseY;
		}
		else if (this.mouseY > this._touchDown)
		{
			this._samplesContainer.y += delta;
			if (this._samplesContainer.y > 20) this._samplesContainer.y = 20;
			this._touchDown = this.mouseY;
		}

		this._scrollPercent = Math.abs((this._samplesContainer.y - 20) / (this._samplesContainer.height - this._samplesMask.height - 60));
	}

} 

CanvasKitInit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/'+file,
}).then((canvasKit:CanvasKit) => {
    FPConfig.canvasKit = canvasKit;
    new Main();
});