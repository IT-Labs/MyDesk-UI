class Solution {
    public int romanToInt(String s) {
        String[] ss=s.split("");
        int sum=0;
        for(int i=0;i<ss.length;i++){
            if((ss[i-1]=='I' && ss[i]=='V') || (ss[i-1]=='I' && ss[i]=='X')){
                sum-=1;
            }
            if((ss[i-1]=='X' && ss[i]=='L') || (ss[i-1]=='X' && ss[i]=='C'))                sum-=10;
            if((ss[i-1]=='X' && ss[i]=='D') || (ss[i-1]=='X' && ss[i]=='M'))                sum-=100;
            switch(ss[i]){
                case 'I': sum+=1;
                case 'V': sum+=5;
                case 'X': sum+=10;
                case 'L': sum+=50;
                case 'C': sum+=100;
                case 'D': sum+=500;
                case 'M': sum+=1000;
            }
        }
        
    }
    
}