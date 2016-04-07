# model_collection_api

#How to install

1. Clone repository or download zip file.
2. Create a config.json file in the root directory of the api.
3. Add necessary config files in the following format (replace details in '< >' with specific details):
      ```javascript
      {
        "db" : {
          "host" : "<name_of_host>",
          "user" : "<username>",
          "password" : "<your_password>",
          "database" : "<name_of_database_to_connect_to>"
        },
        //may vary based on mailer used, example here is mailgun
        "mailer" : {
          "auth" : {
            "api_key" : "<your_api_key>",
            "domain" : "<your_domain>"
          },
          "sender" : "<mailgun_sender>",
          "host" : "<host_of_the_api>",
          "port" : <port_used_by_the_api>,
          "secret" : "<secret_used_to_encode_activation_email>"
        },
        //token used to verify user session
        "token" : {
          "user_secret" : "<secret_used_to_verify_user>",
          "admin_secret" : "<secret_used_to_verify_admin>"
        }
      }
      
      ```
