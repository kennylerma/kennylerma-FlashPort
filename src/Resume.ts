import { Equations, TextField, TextFormat, Tweener } from '@flashport/flashport';
import { Shape, Sprite } from '@flashport/flashport';
import { AEvent } from '@flashport/flashport';
/**
 * ...
 * @author Kenny Lerma
 */
export class Resume extends Sprite
{
	private _blackout:Shape;
	private _iframe:HTMLIFrameElement;
	
	constructor() 
	{
		super();

        this.addEventListener(AEvent.ADDED_TO_STAGE, this.init);
	}
	
	private init = (e:AEvent):void =>
	{
		this.removeEventListener(AEvent.ADDED_TO_STAGE, this.init);
		
		this._blackout = new Shape();
		this._blackout.graphics.clear();
		this._blackout.graphics.beginFill(0x000000, .75);
		this._blackout.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
		this._blackout.addEventListener("click", function():void { }); //Disable Clickthrough
		this.addChild(this._blackout);
		
		this._iframe = document.createElement("iframe") as HTMLIFrameElement;
		this._iframe.id = "resume";
		this._iframe.width = "850";
		this._iframe.height = "900";
		this._iframe.style.position = "absolute";
		
		//iframe.allowFullscreen = true;
		this._iframe.frameBorder = "0";
		this._iframe.src = "https://docs.google.com/document/d/e/2PACX-1vQ_2a3hxFb155mm6EE5rsz9PdalrXN-TMET1HDsnA8ViZeHq_Umc5HefjXhOWx83OmGvPqEnMNb8TSO/pub?embedded=true";
		document.getElementById("overlayDiv").appendChild(this._iframe); //Add to overlay div..it has absolute positioning.
		
		
		this._iframe.style.left = (((this.stage.stageWidth - 850) / 2) + "px").toString();
		this._iframe.style.top = "-" + 900 + "px";
		
		Tweener.addTween(this, {time:1, iframeTop:(this.stage.stageHeight - 900) / 2, transition:Equations.easeOutBounce});
	}

    public set iframeTop(value:number) 
	{
		this._iframe.style.top = value + "px";
	}
	
	public get iframeTop():number
	{
		return parseFloat(this._iframe.style.top);
	}
}