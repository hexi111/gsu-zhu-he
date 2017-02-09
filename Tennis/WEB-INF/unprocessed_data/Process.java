import java.io.*;

class Process{
	public static void main(String [] args){
		try{
			BufferedReader fp = new BufferedReader(new FileReader(new File("m974.txt")));
			BufferedWriter fp1 = new BufferedWriter(new FileWriter(new File("tmp.txt")));
			String line = fp.readLine();
			while(line!=null){
				System.out.println("line="+line);
				String [] numbers = line.split(":");
				int num = Integer.valueOf(numbers[0])*3600+Integer.valueOf(numbers[1])*60+Integer.valueOf(numbers[2])-388;
				int hour = num/3600;
				int min = (num-hour*3600)/60;
				int sec = (num -  hour*3600 - min*60);
				fp1.write(hour+":"+min+":"+sec);
				fp1.newLine();
				line = fp.readLine();
			}
			fp.close();
			fp1.close();
		}
		catch(Exception e){
		}
	}
}