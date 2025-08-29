import React from "react";

const BookAppointment = () => {
  return (
    <div>
     <div class="container-fluid">
        <div class="banner mb-12">
        <div class="container mx-auto">
          <div class="row">
              <div class="col-lg-12">
                <h2 class="banner-title">Book Appointment</h2>
          <div class="breadcrumb">
              <a href="/">Home</a> <span>/</span> 
              <span>Book Appointment</span>
            </div>
          </div>    
          </div>
          </div>
        </div>
      </div>


    <div className="container pb-8"> 
     <div className="row">
          <div className="col-lg-8">
             <div className="booking-form-container">
                <h2 className="booking-form-title">Book a Doctor’s Appointment</h2>
                <form>
                    <div className="booking-form-row">
                        <div className="booking-form-group">
                            <label for="fname" className="booking-form-label">First Name</label>
                            <input type="text" id="fname" name="fname" className="booking-form-input" />
                        </div>
                        <div className="booking-form-group">
                            <label for="lname" className="booking-form-label">Last Name</label>
                            <input type="text" id="lname" name="lname" className="booking-form-input" />
                        </div>
                    </div>
                    <div className="booking-form-row">
                        <div className="booking-form-group">
                            <label for="mobile" className="booking-form-label">Mobile Number</label>
                            <input type="text" id="mobile" name="mobile" className="booking-form-input" />
                        </div>
                        <div className="booking-form-group">
                            <label for="email" className="booking-form-label">Email Address</label>
                            <input type="email" id="email" name="email" className="booking-form-input" />
                        </div>
                    </div>
                    <div className="booking-form-checkbox-group">
                        <input type="checkbox" id="whatsapp-bform" name="whatsapp" className="booking-form-checkbox" />
                        <label for="whatsapp-bform" className="booking-form-checkbox-label">This is My WhatsApp Number</label>
                    </div>
                    <div className="booking-form-group">
                        <label for="doctor" className="booking-form-label">Select Doctor</label>
                        <select id="doctor" name="doctor" className="booking-form-select">
                            <option value="">-- Select Doctor --</option>
                        </select>
                    </div>
                    <div className="booking-form-row">
                        <div className="booking-form-group">
                            <label for="date" className="booking-form-label">Select Appointment Date</label>
                            <input type="date" id="date" name="date" className="booking-form-input" />
                        </div>
                        <div className="booking-form-group">
                            <label for="time" className="booking-form-label">Select Time Slot</label>
                            <select id="time" name="time" className="booking-form-select">
                                <option value="">-- Select Time Slot --</option>
                            </select>
                        </div>
                    </div>
                    <div className="booking-form-checkbox-group">
                        <input type="checkbox" id="terms-bform" name="terms" className="booking-form-checkbox" />
                        <label for="terms-bform" className="booking-form-checkbox-label">
                            I agree to the Terms & Conditions and Privacy Policy.
                        </label>
                    </div>
                    <div className="booking-form-checkbox-group">
                        <input type="checkbox" id="consent-bform" name="consent" className="booking-form-checkbox" />
                        <label for="consent-bform" className="booking-form-checkbox-label">
                            I agree to be contacted by Agastya Hospital or its representative through SMS/Email, WhatsApp or call. This consent will override any registration for NDNC.
                        </label>
                    </div>
                    <button type="submit" className="booking-form-btn-submit">Submit</button>
                </form>
            </div>
          </div>


           <div className="col-lg-4">
            <aside className="appointment-sidebar">
                
                  <div className="sidebar-section sep">
                      <h5 className="title">
                      If you need any assistance in booking an appointment, please call our 24/7 Helpline Number
                      </h5>
                      <ul className="sep">
                          <li>040 - 65 108 108</li>
                          <li>+91 9459 108 108</li>
                      </ul>
                  </div>
                  
                  <div className="sidebar-section">
                      <h5 className="title">
                      Visit our hospital for a free second opinion
                      </h5>
                      <ul className="sep">
                          <li>Nagarjuna Sagar Rd, Jahangir Nagar Colony, Omkar Nagar, Hyderabad, Telangana 500074</li>
                          <li style={{listStyle: "none"}}><a href="#" className="directions-btn">View Directions</a></li>
                      </ul>
                  </div>
                  
                  <div className="sidebar-section">
                      <h5 className="title">
                      Book an ambulance in case of an emergency
                      </h5>
                      <ul>
                          <li>040 - 65 108 108</li>
                          <li>+91 9459 108 108</li>
                      </ul>
                  </div>
                        
            </aside>
            
        </div>
        </div>
    </div>
    </div>
  );
};

export default BookAppointment;