import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { FormsModule } from '@angular/forms';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, FormsModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have initial login state as false', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isLoggedIn()).toBeFalsy();
  });

  it('should sign in successfully with correct credentials', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.username.set('admin');
    app.password.set('admin123');
    app.signIn();
    
    expect(app.isLoggedIn()).toBeTruthy();
    expect(app.errorMessage()).toBe('');
  });

  it('should show error message with incorrect credentials', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.username.set('wrong');
    app.password.set('wrong');
    app.signIn();
    
    expect(app.isLoggedIn()).toBeFalsy();
    expect(app.errorMessage()).toBe('Invalid username or password');
  });
});
