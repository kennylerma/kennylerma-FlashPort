import { TextField, TextFormat } from '@flashport/flashport';
import { Shape, Sprite } from '@flashport/flashport';
import { AEvent } from '@flashport/flashport';
/**
 * ...
 * @author Kenny Lerma
 */
export class Hire extends Sprite
{
	private _blackout:Shape;
	private _formContainer:Sprite;
	private _formBG:Shape;
	
	constructor() 
	{
		super();

		this.init();
	}
	
	private init = ():void =>
	{
		this.removeEventListener(AEvent.ADDED_TO_STAGE, this.init);
		
		this._blackout = new Shape();
		this._blackout.graphics.clear();
		this._blackout.graphics.beginFill(0x000000, .75);
		this._blackout.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
		this._blackout.addEventListener("click", function():void { }); //Disable Clickthrough
		this.addChild(this._blackout);
		
		this._formContainer = new Sprite();
		
		this._formBG = new Shape();
		this._formBG.graphics.beginFill(0xCCCCCC);
		this._formBG.graphics.drawRoundRect(0, 0, 400, 250, 9);
		this._formBG.addEventListener("click", function():void { }); //Disable Clickthrough
		this._formContainer.addChild(this._formBG);
		
		var headerTxt:TextField = new TextField();
		var tf:TextFormat = new TextFormat("Arial", 24, 0x2D96FF, true);
		headerTxt.defaultTextFormat = tf;
		headerTxt.text = "Looking to Hire?";
		headerTxt.x = 20;
		headerTxt.y = 20;
		this._formContainer.addChild(headerTxt);
		
		var blurbTxt:TextField = new TextField();
		tf = new TextFormat("Arial", 16, 0x464646, true);
		blurbTxt.defaultTextFormat = tf;
		blurbTxt.text = "I'm always looking for interesting projects\nand people to work with.  So, send me a\nmessage to discuss your next project.";
		blurbTxt.height = 20;
		blurbTxt.width = 380;
		blurbTxt.x = 20;
		blurbTxt.y = 60;
		this._formContainer.addChild(blurbTxt);
		
		var emailTxt:TextField = new TextField();
		tf = new TextFormat("Arial", 20, 0x464646, true);
		emailTxt.defaultTextFormat = tf;
		emailTxt.wordWrap = true;
		emailTxt.text = "Email: kenny@kennylerma.com";
		var phoneTxt:TextField = new TextField();
		phoneTxt.defaultTextFormat = tf;
		phoneTxt.text = "LinkedIn: linkedin.com/in/kennylerma";
		
		emailTxt.x = 20;
		emailTxt.y = 150;
		phoneTxt.x = 20;
		phoneTxt.y = 180;
		this._formContainer.addChild(emailTxt);
		this._formContainer.addChild(phoneTxt);
		
		this._formContainer.x = (this.stage.stageWidth - 400) / 2;
		this._formContainer.y = (this.stage.stageHeight - 500) / 2;
		this.addChild(this._formContainer);
	}
}