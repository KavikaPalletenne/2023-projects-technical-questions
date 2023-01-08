1.  Identify one problem in the below code block, will this code compile? Discuss the related Rust feature regarding the problem you have identified, why does Rust choose to include this feature? A few sentences are good enough.

    ```rust
        let data = vec![1, 2, 3];
        let my_ref_cell = RefCell::new(69);
        let ref_to_ref_cell = &my_ref_cell;

        std::thread::spawn(move || {

            println!("captured {data:?} by value");

            println!("Whats in the cell?? {ref_to_ref_cell:?}")

        }).join().unwrap();
    ```

    A: This code will not compile because sharing `ref_to_ref_cell`, which is of type `&RefCell<i32>` between threads, is not allowed. `RefCell` allows values to be borrowed both mutably and immutably as long as it doesn't occur at the same time. However, as it does not implement `Sync`, it cannot be used in multithreading. Rust prevents this to make sure no data races occur when accessing the value in `RefCell`.


2.  Shortly discuss, when modelling a response to a HTTP request in Rust, would you prefer to use `Option` or `Result`?

    A: Use `Result` as the response to the request can be either successful or an error. For example, if the response is processed correctly by the server with no errors, then it would be an `Ok`, however if there is an error, then it should be of type `Err`. `Option` is not suitable here as it is used when the inner value can be `null`, and there should always be a response from the server.


3.  In `student.psv` there are some fake student datas from UNSW CSE (no doxx!). In each row, the fields from left to right are

    - UNSW Course Code
    - UNSW Student Number
    - Name
    - UNSW Program
    - UNSW Plan
    - WAM
    - UNSW Session
    - Birthdate
    - Sex

    Write a Rust program to find the course which has the highest average student WAM. **Write your program in the cargo project q3**.

    ***Code written in `main.rs`***
