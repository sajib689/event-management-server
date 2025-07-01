export interface IEvent {
  _id?: string; 
  title: string;
  postedBy: string; 
  dateTime: string; 
  location: string;
  description: string;
  attendeeCount: number; 
  joinedUsers: string[];
}
