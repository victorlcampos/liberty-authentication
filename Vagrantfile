# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"
LIBERTY_ROOT            = "../../"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box     = "precise64_docker"
  config.vm.box_url = "http://bit.ly/vagrant-docker-precise"

  config.vm.synced_folder "./project"                , "/vagrant"                 , create: true
  config.vm.synced_folder "#{LIBERTY_ROOT}grunt-init-templates", "/home/vagrant/.grunt-init", create: true

  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.ssh.forward_agent = true

  config.vm.provider :docker do |docker|
  end

  config.vm.provision :puppet do |puppet|
    puppet.module_path = "#{LIBERTY_ROOT}puppet-modules"
    puppet.facter = {
      "is_vagrant" => true
    }
  end
end
