import { AssetLoader } from '@flashport/flashport';
import { Bitmap, BitmapData, Shape, Sprite, Stage} from '@flashport/flashport';
import { AEvent, MouseEvent, TouchEvent } from '@flashport/flashport';
import { Tweener } from '@flashport/flashport';
import { Equations } from '@flashport/flashport';
import { DropShadowFilter } from '@flashport/flashport';
import { URLLoader, URLRequest } from '@flashport/flashport';
import { Sample } from './com/kennylerma/display/Sample';
import { TextField, TextFormat } from '@flashport/flashport';
import { MobileCheck } from './com/kennylerma/utils/MobileCheck';
import { FPConfig } from '@flashport/flashport';
/**
 * ...
 * @author Kenny Lerma
 */
export class Samples extends Sprite
{
	private _mainStage:Stage;
	private _blackout:Sprite;
	private _isMobile:boolean;
	private _iframe:HTMLIFrameElement;
	private xmlList:HTMLCollection;
	private _samples:Sample[] = [];
	private _sampleActive:boolean = false;
	private _justExited:boolean = false;
	
	constructor(stage:Stage) 
	{
		super();
		
		this._mainStage = stage;
		this._isMobile = MobileCheck.isMobile();
		this._blackout = new Sprite();
	}
	
	public init():void 
	{
		var req:URLRequest = new URLRequest("./assets/samples.xml")
		var xmlLoader:URLLoader = new URLLoader();
		xmlLoader.addEventListener(AEvent.COMPLETE, this.handleXMLLoaded);
		xmlLoader.load(req);
	}
	
	private handleXMLLoaded = (e:AEvent):void =>
	{
		var xml:XMLDocument = new DOMParser().parseFromString(e.currentTarget.data, 'text/xml');
		this.xmlList = xml.getElementsByTagName('sample');
		
		var manifest:string[] = [];
		for (var i:number = 0; i < this.xmlList.length; i++) 
		{
			manifest.push(this.xmlList[i].getAttribute('poster'));
		}
		
		var assetLoader:AssetLoader = new AssetLoader(manifest);
		assetLoader.addEventListener(AEvent.COMPLETE, this.OnImagesComplete);
		assetLoader.load();
	};
	
	private OnImagesComplete = (e:AEvent):void =>
	{
		//console.log("OnImagesComplete");
		
		e.currentTarget.removeEventListener(AEvent.COMPLETE, this.OnImagesComplete);

		var SCALE:number = this._isMobile ? .75 : .85;
		var MIN_PADDING:number = 40;
		var totalImgSpace:number = (460 * SCALE) + (MIN_PADDING / 2);
		var COLUMNS:number = Math.floor(this._mainStage.stageWidth / totalImgSpace);
		var PADDING:number = (this._mainStage.stageWidth - (COLUMNS * (460 * SCALE))) / (COLUMNS + 1);
		var leftShift:number = ((this._mainStage.stageWidth - ((460 * SCALE + PADDING) * COLUMNS)) / 2) + (PADDING / 2);
		
		for (var i:number = 0; i < this.xmlList.length; i++)
		{
			let poster:string = this.xmlList[i].getAttribute('poster');
			let url:string = this.xmlList[i].getAttribute('url');
			let target:string = this.xmlList[i].getAttribute('target');
			let frameWidth:number = parseInt(this.xmlList[i].getAttribute('frameWidth'));
			let frameHeight:number = parseInt(this.xmlList[i].getAttribute('frameHeight'));
			var imgHolder:Sample = new Sample(poster, url, target, frameWidth, frameHeight);
			var posterName:string = poster.substr(poster.lastIndexOf("/") + 1).replace(".jpg", "").replace(".webp", "");
			
			var bmd:BitmapData = FPConfig.images[posterName];
			var img:Bitmap = new Bitmap(bmd);
			img.name = "sample_" + i;
			imgHolder.addChild(img);
			imgHolder.buttonMode = true;
			imgHolder.name = url;
			imgHolder.scaleX = SCALE;
			imgHolder.scaleY = imgHolder.scaleX;
			imgHolder.addEventListener(this._isMobile ? TouchEvent.TOUCH_END : MouseEvent.CLICK, this.OnSampleClicked);
			imgHolder.x = ((i % COLUMNS) * (imgHolder.width + PADDING)) + leftShift;
			imgHolder.y = Math.floor(i / COLUMNS) * (imgHolder.height + 50) + 80;
			//imgHolder.filters = [new DropShadowFilter(5, 45, 0x000000, 1, 5, 5, 100)];
			imgHolder.alpha = 0;
			
			this._samples.push(imgHolder);
			
			var tf:TextFormat = new TextFormat("Arial", 16, 0xFFFFFF, true);
			var title:TextField = new TextField();
			title.defaultTextFormat = tf;
			title.text = this.xmlList[i].getAttribute('title');
			title.y = img.height + 2;
			imgHolder.addChild(title);
			
			this.addChild(imgHolder);				
			
			Tweener.addTween(imgHolder, {time:1.2, delay: i * .08, alpha:1});
		}			
		
		this.graphics.beginFill(0xFFFFF, 0);
		this.graphics.drawRect(0, 20, this._mainStage.stageWidth, this.height + PADDING);
		
		this.y = 20;
		
		this.dispatchEvent(new AEvent("SAMPLES_READY", false, false));
	};
	
	private OnSampleClicked = (e:AEvent):void =>
	{
		//console.log("Samples.OnSampleClicked() open: " + e.target.name);
		
		if (this._justExited && this._isMobile)
		{
			this._justExited = false;
			return;
		}
		
		// is this a link?
		var sample:Sample = e.currentTarget as Sample;
		if (sample.target && sample.target == "blank")
		{
			window.open(sample.url, "_blank");
			return;
		}
		
		this._blackout.addEventListener(this._isMobile ? TouchEvent.TOUCH_BEGIN : MouseEvent.CLICK, this.CloseVideo);
		this._blackout.graphics.clear();
		this._blackout.graphics.beginFill(0x000000, .75)
		this._blackout.graphics.drawRect(0, 0, this._mainStage.stageWidth, this._mainStage.stageHeight);
		
		(this._mainStage.root as Sprite).addChild(this._blackout);
		
		this._iframe = document.createElement("iframe") as HTMLIFrameElement;
		this._iframe.id = "youtubeVideo";
		this._iframe.width = sample.frameWidth.toString();
		this._iframe.height = sample.frameHeight.toString();
		this._iframe.style.position = "absolute";
		this._iframe.scrolling = "no";
		//iframe.allowFullscreen = true;
		this._iframe.frameBorder = "0";
		this._iframe.src = sample.url;
		document.getElementById("overlayDiv").appendChild(this._iframe); //Add to overlay div..it has absolute positioning.
		
		
		this._iframe.style.left = (((this._mainStage.stageWidth - sample.frameWidth) / 2) + "px").toString();
		this._iframe.style.top = "-" + sample.frameHeight + "px";
		
		Tweener.addTween(this, {time:1, iframeTop:(this._mainStage.stageHeight - sample.frameHeight) / 2, transition:Equations.easeOutBounce});
		
		this.disableSamples();
		
		this._sampleActive = true;
	};
	
	public disableSamples = ():void =>
	{
		this._samples.map((value) => {
			value.removeEventListener(this._isMobile ? TouchEvent.TOUCH_END : MouseEvent.CLICK, this.OnSampleClicked);
			value.mouseEnabled = false;
		});
	};
	
	public enableSamples = ():void =>
	{
		if (!this._sampleActive)
		{
			this._samples.map((value) => {
				value.addEventListener(this._isMobile ? TouchEvent.TOUCH_END : MouseEvent.CLICK, this.OnSampleClicked);
				value.mouseEnabled = true;
			});
		}
	};
	
	public set iframeTop(value:number) 
	{
		this._iframe.style.top = value + "px";
	}
	
	public get iframeTop():number
	{
		return parseFloat(this._iframe.style.top);
	}
	
	private CloseVideo = (e:AEvent):void =>
	{
		this._blackout.removeEventListener(this._isMobile ? TouchEvent.TOUCH_BEGIN : MouseEvent.CLICK, this.CloseVideo);
		(this._mainStage.root as Sprite).removeChild(this._blackout);
		
		var element:HTMLElement = document.getElementById("youtubeVideo") as HTMLElement;
		element.parentNode.removeChild(element);
		
		this._justExited = true;
		this._sampleActive = false;
		this.enableSamples();
	};
	
	public resizeLayout = ():void =>
	{
		var SCALE:number = .85;
		var MIN_PADDING:number = 40;
		var totalImgSpace:number = (460 * SCALE) + (MIN_PADDING / 2);
		var COLUMNS:number = Math.floor(this._mainStage.stageWidth / totalImgSpace);
		var PADDING:number = (this._mainStage.stageWidth - (COLUMNS * (460 * SCALE))) / (COLUMNS + 1);
		var leftShift:number = ((this.stage.stageWidth - ((460 * SCALE + PADDING) * COLUMNS)) / 2) + (PADDING / 2);
		
		this.graphics.clear();

		for (var i:number = 0; i < this._samples.length; i++) 
		{
			var img:Sample = this._samples[i];
			img.x = (i % COLUMNS) * (img.width + PADDING) + PADDING;
			img.y = Math.floor(i / COLUMNS) * (img.height + PADDING) + PADDING + 80;
			img.x = ((i % COLUMNS) * (img.width + PADDING)) + leftShift;
			img.y = Math.floor(i / COLUMNS) * (img.height + 50) + 80;
		}
		
		this.graphics.beginFill(0xFFFFFF, 0);
		this.graphics.drawRect(0, 20, this._mainStage.stageWidth, this.getBounds(this).height + PADDING);

		this._blackout.graphics.clear();
		this._blackout.graphics.beginFill(0x000000, .75);
		this._blackout.graphics.drawRect(0, 0, this._mainStage.stageWidth, this._mainStage.stageHeight);
		
		this.dispatchEvent(new AEvent("SAMPLES_READY", false, false));
	};
}