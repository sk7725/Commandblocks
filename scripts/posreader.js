//MessageBlock의 딸을 생성한다.
const posreader = extendContent(MessageBlock, "posreader", {
	buildConfiguration(tile, table){
		//버튼 비활성화(아마도)
	},

	placed(tile) {
		//블럭 설치될때
		this.super$placed(tile);
		//이거는 부모(메세지블럭)의 유전자? 함수? 를 그대로 옮겨온다.
		const x=tile.x//요거의 x좌표
    const y=tile.y//요거의 y좌표
    Call.setMessageBlockText(null,tile,"Pos:("+x+","+y+")/Rot:"+tile.rotation()+"/WPos:("+tile.worldx()+","+tile.worldy()+")");
		// this는 이거 및 이거의 부모의 모든 함수를 가져온다. 이거의 바로 위 부모(이 블럭은 MessageBlock의 딸이고 Block의 손자!)는 setMessageBlockText라는 함수가 있다.
		// https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/world/blocks/logic/MessageBlock.java 여기에 있다!
	}
	//SOL님 힘내세요!
});
