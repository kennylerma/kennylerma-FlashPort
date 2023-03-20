import { Sprite, Shape } from '@flashport/flashport';
import { AEvent, MouseEvent } from '@flashport/flashport';
import { Matrix } from '@flashport/flashport';

/**
 * ...
 * @author Kenny Lerma
 */
export class Scrollbar extends Sprite
{
	private _size:number;
	private _track:Shape;
	private _handle:Sprite;
	private _value:number = 0;
	private _mat:Matrix;
	private degrees:number = 90;
	private radians:number = Math.PI / 180 * this.degrees;
	
	constructor(size:number) 
	{
		super();

		this._size = size;
		
		this.Draw();
		this.Enable();
	}
	
	private Enable = ():void =>
	{
		this._handle.addEventListener(MouseEvent.MOUSE_DOWN, this.handleMouseDown);
	};
	
	private handleMouseDown = (e:MouseEvent):void =>
	{
		this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.handleMouseMove);
		this.stage.addEventListener(MouseEvent.MOUSE_UP, this.handleMouseUp);
	};
	
	private handleMouseUp = (e:MouseEvent):void =>
	{
		this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.handleMouseMove);
		this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.handleMouseUp);
	};
	
	private handleMouseMove = (e:MouseEvent): void =>
	{
		this._handle.y = e.stageY - (20 * 4) - 8;
		
		//restrict scroll area
		if (this._handle.y < 0) { this._handle.y = 0; }
		if (this._handle.y > (this._size - (20 * 2))) { this._handle.y = this._size - (20 * 2); }
		
		var currentPos:number = this._handle.y; //get Handle Y;
		var endPos:number = this._size - (20 * 2);
		this._value = currentPos / endPos;
		
		//console.log("Scrollbar value: " + _value);
		this.dispatchEvent(new AEvent("change"));
	};
	
	private Draw = ():void =>
	{
		this._mat = new Matrix();
		
		this._track = new Shape();
		this._track.graphics.lineStyle(2, 0xFFFFFF);//  setStrokeStyle(2, "round").beginStroke("#FFFFFF");
		this._mat.createGradientBox(this._size, 5, this.radians, 0, 0);
		this._track.graphics.beginGradientFill("linear", [0x464646, 0x999999], [1, .5], [0, 255], this._mat);
		this._track.graphics.drawRoundRect(0, 0, 20, this._size, 5, 5);
		//_track.addEventListener("click", function(){}); //Disable Clickthrough
		this.addChild(this._track);
		
		var handleWidth:number = 20;
		var handleHeight:number = handleWidth * 2;
		this._handle = new Sprite();
		this._handle.graphics.lineStyle(2, 0xFFFFFF); // setStrokeStyle(2, "round").beginStroke("#FFFFFF");
		this._mat.createGradientBox(1, this._handle.height, this.radians, 0, 0);
		this._handle.graphics.beginGradientFill("linear", [0x800000, 0x640000], [1, .5], [0, 255], this._mat);
		this._handle.graphics.drawRoundRect(0, 0, handleWidth, handleHeight, 5, 5);
		
		this._handle.graphics.lineStyle(1, 0xCCCCCC); //setStrokeStyle(1, "round").beginStroke("#CCCCCC");
		this._handle.graphics.moveTo(7, (handleHeight / 2));
		this._handle.graphics.lineTo(handleWidth - 7, handleHeight / 2);
		this._handle.graphics.moveTo(7, (handleHeight / 2) + 4);
		this._handle.graphics.lineTo(handleWidth - 7, (handleHeight / 2) + 4);
		this._handle.graphics.moveTo(7, (handleHeight / 2) - 4);
		this._handle.graphics.lineTo(handleWidth - 7, (handleHeight / 2) - 4);
		this._handle.buttonMode = true;
		this._handle.y = 0;
		this.addChild(this._handle);
	};
	
	public resize = (size:number):void =>
	{
		this._size = size;
		
		this._track.graphics.clear();
		this._track.graphics.lineStyle(2, 0xFFFFFF); //setStrokeStyle(2, "round").beginStroke("#FFFFFF");
		this._mat.createGradientBox(this._size, 5, this.radians, 0, 0);
		this._track.graphics.beginGradientFill("linear", [0x464646, 0x999999], [1, .5], [0, 255], this._mat);
		this._track.graphics.drawRoundRect(0, 0, 20, this._size, 5, 5);
		
		this._handle.y = (this._size - (20 * 2)) * this._value;
	};

	public set value(scroll:number)
	{
		this._value = scroll;
		if (this._value > 1) { this._value = 1; }
		if (this._value < 0) { this._value = 0; }
		this._handle.y = (this._size - (20 * 2)) * this._value;
		this.dispatchEvent(new AEvent("change"));
	}

	public get value():number
	{
		return this._value;
	}
}